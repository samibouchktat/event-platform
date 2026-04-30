package com.eventplatform.service.impl;

import com.eventplatform.dto.document.BookingDocumentCreateRequest;
import com.eventplatform.dto.document.BookingDocumentResponse;
import com.eventplatform.entity.Booking;
import com.eventplatform.entity.BookingDocument;
import com.eventplatform.entity.DocumentType;
import com.eventplatform.entity.ProviderProfile;
import com.eventplatform.entity.RoleName;
import com.eventplatform.entity.User;
import com.eventplatform.exception.ApiException;
import com.eventplatform.mapper.BookingDocumentMapper;
import com.eventplatform.repository.BookingDocumentRepository;
import com.eventplatform.repository.BookingRepository;
import com.eventplatform.repository.ProviderProfileRepository;
import com.eventplatform.repository.UserRepository;
import com.eventplatform.service.BookingDocumentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class BookingDocumentServiceImpl implements BookingDocumentService {

    private final BookingDocumentRepository bookingDocumentRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final ProviderProfileRepository providerProfileRepository;
    private final BookingDocumentMapper bookingDocumentMapper;

    @Value("${app.upload.documents-dir:uploads/documents}")
    private String documentsUploadDir;
    @Override
    public BookingDocumentResponse uploadProviderBookingDocument(
            String providerEmail,
            Long bookingId,
            String title,
            String documentTypeValue,
            String description,
            MultipartFile file
    ) {
        User providerUser = getUserByEmail(providerEmail);

        ensureUserIsProvider(providerUser);

        ProviderProfile providerProfile = getProviderProfile(providerUser);

        Booking booking = bookingRepository.findByIdAndProviderProfile(bookingId, providerProfile)
                .orElseThrow(() -> new ApiException(
                        HttpStatus.NOT_FOUND,
                        "Booking not found for this provider"
                ));

        if (file == null || file.isEmpty()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "File is required");
        }

        validateUploadedFile(file);

        DocumentType documentType = parseDocumentType(documentTypeValue);

        String storedFileName = storeFile(file);
        String fileUrl = "/api/documents/files/" + storedFileName;

        BookingDocument document = BookingDocument.builder()
                .booking(booking)
                .uploadedBy(providerUser)
                .documentType(documentType)
                .title(cleanRequired(title, "Title is required"))
                .fileUrl(fileUrl)
                .description(cleanNullable(description))
                .build();

        BookingDocument savedDocument = bookingDocumentRepository.save(document);

        return bookingDocumentMapper.toResponse(savedDocument);
    }
    private void validateUploadedFile(MultipartFile file) {
        String contentType = file.getContentType();

        Set<String> allowedContentTypes = Set.of(
                "application/pdf",
                "image/png",
                "image/jpeg",
                "image/jpg",
                "image/webp"
        );

        if (contentType == null || !allowedContentTypes.contains(contentType)) {
            throw new ApiException(
                    HttpStatus.BAD_REQUEST,
                    "Invalid file type. Allowed: PDF, PNG, JPG, WEBP"
            );
        }
    }

    private String storeFile(MultipartFile file) {
        try {
            Path uploadPath = Paths.get(documentsUploadDir).toAbsolutePath().normalize();
            Files.createDirectories(uploadPath);

            String originalFilename = file.getOriginalFilename();
            String extension = getFileExtension(originalFilename);

            String storedFileName = UUID.randomUUID() + extension;
            Path targetPath = uploadPath.resolve(storedFileName).normalize();

            file.transferTo(targetPath.toFile());

            return storedFileName;
        } catch (IOException exception) {
            throw new ApiException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Could not store uploaded file"
            );
        }
    }

    private String getFileExtension(String filename) {
        if (filename == null || filename.trim().isEmpty()) {
            return "";
        }

        String cleanFilename = filename.trim();
        int dotIndex = cleanFilename.lastIndexOf(".");

        if (dotIndex < 0) {
            return "";
        }

        return cleanFilename.substring(dotIndex).toLowerCase();
    }
    @Override
    public BookingDocumentResponse createProviderBookingDocument(
            String providerEmail,
            Long bookingId,
            BookingDocumentCreateRequest request
    ) {
        User providerUser = getUserByEmail(providerEmail);

        ensureUserIsProvider(providerUser);

        ProviderProfile providerProfile = getProviderProfile(providerUser);

        Booking booking = bookingRepository.findByIdAndProviderProfile(bookingId, providerProfile)
                .orElseThrow(() -> new ApiException(
                        HttpStatus.NOT_FOUND,
                        "Booking not found for this provider"
                ));

        DocumentType documentType = parseDocumentType(request.getDocumentType());

        BookingDocument document = BookingDocument.builder()
                .booking(booking)
                .uploadedBy(providerUser)
                .documentType(documentType)
                .title(cleanRequired(request.getTitle(), "Title is required"))
                .fileUrl(cleanRequired(request.getFileUrl(), "File URL is required"))
                .description(cleanNullable(request.getDescription()))
                .build();

        BookingDocument savedDocument = bookingDocumentRepository.save(document);

        return bookingDocumentMapper.toResponse(savedDocument);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookingDocumentResponse> getProviderBookingDocuments(
            String providerEmail,
            Long bookingId
    ) {
        User providerUser = getUserByEmail(providerEmail);

        ensureUserIsProvider(providerUser);

        ProviderProfile providerProfile = getProviderProfile(providerUser);

        Booking booking = bookingRepository.findByIdAndProviderProfile(bookingId, providerProfile)
                .orElseThrow(() -> new ApiException(
                        HttpStatus.NOT_FOUND,
                        "Booking not found for this provider"
                ));

        return bookingDocumentRepository.findByBookingOrderByCreatedAtDesc(booking)
                .stream()
                .map(bookingDocumentMapper::toResponse)
                .toList();
    }

    @Override
    public void deleteProviderBookingDocument(
            String providerEmail,
            Long bookingId,
            Long documentId
    ) {
        User providerUser = getUserByEmail(providerEmail);

        ensureUserIsProvider(providerUser);

        ProviderProfile providerProfile = getProviderProfile(providerUser);

        Booking booking = bookingRepository.findByIdAndProviderProfile(bookingId, providerProfile)
                .orElseThrow(() -> new ApiException(
                        HttpStatus.NOT_FOUND,
                        "Booking not found for this provider"
                ));

        BookingDocument document = bookingDocumentRepository.findByIdAndBooking(documentId, booking)
                .orElseThrow(() -> new ApiException(
                        HttpStatus.NOT_FOUND,
                        "Document not found for this booking"
                ));

        bookingDocumentRepository.delete(document);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookingDocumentResponse> getClientBookingDocuments(
            String clientEmail,
            Long bookingId
    ) {
        User client = getUserByEmail(clientEmail);

        ensureUserIsClient(client);

        Booking booking = bookingRepository.findByIdAndClient(bookingId, client)
                .orElseThrow(() -> new ApiException(
                        HttpStatus.NOT_FOUND,
                        "Booking not found for this client"
                ));

        return bookingDocumentRepository.findByBookingOrderByCreatedAtDesc(booking)
                .stream()
                .map(bookingDocumentMapper::toResponse)
                .toList();
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email.trim().toLowerCase())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found"));
    }

    private ProviderProfile getProviderProfile(User providerUser) {
        return providerProfileRepository.findByUser(providerUser)
                .orElseThrow(() -> new ApiException(
                        HttpStatus.NOT_FOUND,
                        "Provider profile not found"
                ));
    }

    private void ensureUserIsProvider(User user) {
        boolean isProvider = user.getRoles()
                .stream()
                .anyMatch(role -> role.getName() == RoleName.ROLE_PROVIDER);

        if (!isProvider) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Only providers can manage booking documents");
        }
    }

    private void ensureUserIsClient(User user) {
        boolean isClient = user.getRoles()
                .stream()
                .anyMatch(role -> role.getName() == RoleName.ROLE_CLIENT);

        if (!isClient) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Only clients can access client booking documents");
        }
    }

    private DocumentType parseDocumentType(String value) {
        try {
            return DocumentType.valueOf(value.trim().toUpperCase());
        } catch (Exception exception) {
            throw new ApiException(
                    HttpStatus.BAD_REQUEST,
                    "Invalid document type. Allowed values: CONTRACT, QUOTE, INVOICE, PROGRAM, TECHNICAL_SHEET, OTHER"
            );
        }
    }

    private String cleanRequired(String value, String errorMessage) {
        if (value == null || value.trim().isEmpty()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, errorMessage);
        }

        return value.trim();
    }

    private String cleanNullable(String value) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }

        return value.trim();
    }
}