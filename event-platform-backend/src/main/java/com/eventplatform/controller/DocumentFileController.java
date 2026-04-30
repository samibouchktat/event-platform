package com.eventplatform.controller;

import com.eventplatform.exception.ApiException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/documents/files")
public class DocumentFileController {

    @Value("${app.upload.documents-dir:uploads/documents}")
    private String documentsUploadDir;

    @GetMapping("/{filename:.+}")
    public ResponseEntity<Resource> getDocumentFile(
            @PathVariable String filename
    ) {
        try {
            Path uploadPath = Paths.get(documentsUploadDir).toAbsolutePath().normalize();
            Path filePath = uploadPath.resolve(filename).normalize();

            if (!filePath.startsWith(uploadPath)) {
                throw new ApiException(HttpStatus.BAD_REQUEST, "Invalid file path");
            }

            if (!Files.exists(filePath)) {
                throw new ApiException(HttpStatus.NOT_FOUND, "File not found");
            }

            Resource resource = new UrlResource(filePath.toUri());

            if (!resource.exists() || !resource.isReadable()) {
                throw new ApiException(HttpStatus.NOT_FOUND, "File not readable");
            }

            String contentType = Files.probeContentType(filePath);

            if (contentType == null) {
                contentType = MediaType.APPLICATION_OCTET_STREAM_VALUE;
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(
                            HttpHeaders.CONTENT_DISPOSITION,
                            ContentDisposition.inline()
                                    .filename(resource.getFilename())
                                    .build()
                                    .toString()
                    )
                    .body(resource);

        } catch (MalformedURLException exception) {
            throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "Invalid file URL");
        } catch (Exception exception) {
            if (exception instanceof ApiException apiException) {
                throw apiException;
            }

            throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "Could not read file");
        }
    }
}