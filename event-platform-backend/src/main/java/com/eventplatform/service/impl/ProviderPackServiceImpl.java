package com.eventplatform.service.impl;

import com.eventplatform.dto.pack.ProviderPackRequest;
import com.eventplatform.dto.pack.ProviderPackResponse;
import com.eventplatform.entity.ProviderPack;
import com.eventplatform.entity.ProviderProfile;
import com.eventplatform.entity.RoleName;
import com.eventplatform.entity.User;
import com.eventplatform.exception.ApiException;
import com.eventplatform.mapper.ProviderPackMapper;
import com.eventplatform.repository.ProviderPackRepository;
import com.eventplatform.repository.ProviderProfileRepository;
import com.eventplatform.repository.UserRepository;
import com.eventplatform.service.ProviderPackService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Set;
import java.util.UUID;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ProviderPackServiceImpl implements ProviderPackService {

    private final UserRepository userRepository;
    private final ProviderProfileRepository providerProfileRepository;
    private final ProviderPackRepository providerPackRepository;
    private final ProviderPackMapper providerPackMapper;
    private static final String PACK_IMAGE_UPLOAD_DIR = "uploads/pack-images";
    private static final long MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

    private static final Set<String> ALLOWED_IMAGE_CONTENT_TYPES = Set.of(
            "image/jpeg",
            "image/png",
            "image/webp"
    );
    @Override
    public ProviderPackResponse createPack(String email, ProviderPackRequest request) {
        ProviderProfile providerProfile = getProviderProfileForCurrentUser(email);

        validateGuestsRange(request);
        validatePackNameUniqueness(providerProfile, request.getName());

        ProviderPack pack = providerPackMapper.toEntity(request, providerProfile);
        ProviderPack savedPack = providerPackRepository.save(pack);

        return providerPackMapper.toResponse(savedPack);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProviderPackResponse> getMyPacks(String email) {
        ProviderProfile providerProfile = getProviderProfileForCurrentUser(email);

        return providerPackRepository.findByProviderProfileOrderByCreatedAtDesc(providerProfile)
                .stream()
                .map(providerPackMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public ProviderPackResponse getMyPackById(String email, Long packId) {
        ProviderProfile providerProfile = getProviderProfileForCurrentUser(email);

        ProviderPack pack = getPackByIdAndProviderProfile(packId, providerProfile);

        return providerPackMapper.toResponse(pack);
    }

    @Override
    public ProviderPackResponse updatePack(String email, Long packId, ProviderPackRequest request) {
        ProviderProfile providerProfile = getProviderProfileForCurrentUser(email);

        validateGuestsRange(request);

        ProviderPack pack = getPackByIdAndProviderProfile(packId, providerProfile);

        validatePackNameUniquenessForUpdate(providerProfile, pack, request.getName());

        providerPackMapper.updateEntity(pack, request);

        ProviderPack updatedPack = providerPackRepository.save(pack);

        return providerPackMapper.toResponse(updatedPack);
    }

    @Override
    public void deletePack(String email, Long packId) {
        ProviderProfile providerProfile = getProviderProfileForCurrentUser(email);

        ProviderPack pack = getPackByIdAndProviderProfile(packId, providerProfile);

        providerPackRepository.delete(pack);
    }

    @Override
    public ProviderPackResponse togglePackStatus(String email, Long packId) {
        ProviderProfile providerProfile = getProviderProfileForCurrentUser(email);

        ProviderPack pack = getPackByIdAndProviderProfile(packId, providerProfile);

        pack.setActive(!pack.isActive());

        ProviderPack updatedPack = providerPackRepository.save(pack);

        return providerPackMapper.toResponse(updatedPack);
    }

    private ProviderProfile getProviderProfileForCurrentUser(String email) {
        User user = getUserByEmail(email);

        ensureUserIsProvider(user);

        return providerProfileRepository.findByUser(user)
                .orElseThrow(() -> new ApiException(
                        HttpStatus.NOT_FOUND,
                        "Provider profile not found. Please complete onboarding first"
                ));
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email.trim().toLowerCase())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found"));
    }

    private void ensureUserIsProvider(User user) {
        boolean isProvider = user.getRoles()
                .stream()
                .anyMatch(role -> role.getName() == RoleName.ROLE_PROVIDER);

        if (!isProvider) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Only providers can manage packs");
        }
    }

    private ProviderPack getPackByIdAndProviderProfile(Long packId, ProviderProfile providerProfile) {
        return providerPackRepository.findByIdAndProviderProfile(packId, providerProfile)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Pack not found"));
    }

    private void validateGuestsRange(ProviderPackRequest request) {
        if (request.getMinGuests() > request.getMaxGuests()) {
            throw new ApiException(
                    HttpStatus.BAD_REQUEST,
                    "Minimum guests must be less than or equal to maximum guests"
            );
        }
    }

    private void validatePackNameUniqueness(ProviderProfile providerProfile, String packName) {
        String cleanedName = packName.trim();

        if (providerPackRepository.existsByNameAndProviderProfile(cleanedName, providerProfile)) {
            throw new ApiException(HttpStatus.CONFLICT, "Pack name already exists");
        }
    }

    private void validatePackNameUniquenessForUpdate(
            ProviderProfile providerProfile,
            ProviderPack currentPack,
            String newPackName
    ) {
        String cleanedName = newPackName.trim();

        boolean sameNameAsCurrentPack = currentPack.getName().equalsIgnoreCase(cleanedName);

        if (!sameNameAsCurrentPack
                && providerPackRepository.existsByNameAndProviderProfile(cleanedName, providerProfile)) {
            throw new ApiException(HttpStatus.CONFLICT, "Pack name already exists");
        }
    }
    @Override
    public ProviderPackResponse uploadPackImage(String providerEmail, Long packId, MultipartFile file) {
        System.out.println("SERVICE - uploadPackImage");
        System.out.println("providerEmail = " + providerEmail);
        System.out.println("packId = " + packId);
        System.out.println("file is null = " + (file == null));

        if (file != null) {
            System.out.println("fileName = " + file.getOriginalFilename());
            System.out.println("contentType = " + file.getContentType());
            System.out.println("size = " + file.getSize());
        }

        User user = getUserByEmail(providerEmail);
        ProviderProfile providerProfile = getProviderProfileByUser(user);

        ProviderPack pack = providerPackRepository.findByIdAndProviderProfile(packId, providerProfile)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Provider pack not found"));

        validatePackImage(file);

        try {
            Path uploadDir = Paths.get(
                    System.getProperty("user.dir"),
                    "uploads",
                    "pack-images"
            ).toAbsolutePath().normalize();

            Files.createDirectories(uploadDir);

            String originalFilename = file.getOriginalFilename();
            String extension = getFileExtension(originalFilename);

            String filename = UUID.randomUUID() + extension;
            Path destination = uploadDir.resolve(filename).normalize();

            Files.copy(
                    file.getInputStream(),
                    destination,
                    java.nio.file.StandardCopyOption.REPLACE_EXISTING
            );

            String imageUrl = "/uploads/pack-images/" + filename;

            pack.setImageUrl(imageUrl);

            ProviderPack updatedPack = providerPackRepository.save(pack);

            System.out.println("image uploaded to = " + destination);
            System.out.println("imageUrl saved = " + imageUrl);

            return providerPackMapper.toResponse(updatedPack);

        } catch (Exception exception) {
            exception.printStackTrace();

            throw new RuntimeException("UPLOAD_PACK_IMAGE_ERROR: " + exception.getMessage(), exception);
        }
    }

    private ProviderProfile getProviderProfileByUser(User user) {
        return providerProfileRepository.findByUser(user)
                .orElseThrow(() -> new ApiException(
                        HttpStatus.NOT_FOUND,
                        "Provider profile not found"
                ));
    }

    private void validatePackImage(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Image file is required");
        }

        if (file.getSize() > MAX_IMAGE_SIZE_BYTES) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Image size must not exceed 5 MB");
        }

        String contentType = file.getContentType();

        if (contentType == null || !ALLOWED_IMAGE_CONTENT_TYPES.contains(contentType)) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Only JPG, PNG and WEBP images are allowed");
        }
    }

    private String getFileExtension(String filename) {
        if (filename == null || !filename.contains(".")) {
            return ".jpg";
        }

        String extension = filename.substring(filename.lastIndexOf(".")).toLowerCase();

        if (!extension.equals(".jpg")
                && !extension.equals(".jpeg")
                && !extension.equals(".png")
                && !extension.equals(".webp")) {
            return ".jpg";
        }

        return extension;
    }
}