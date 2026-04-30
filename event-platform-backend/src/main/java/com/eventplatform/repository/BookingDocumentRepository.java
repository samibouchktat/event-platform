package com.eventplatform.repository;

import com.eventplatform.entity.Booking;
import com.eventplatform.entity.BookingDocument;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BookingDocumentRepository extends JpaRepository<BookingDocument, Long> {

    List<BookingDocument> findByBookingOrderByCreatedAtDesc(Booking booking);

    Optional<BookingDocument> findByIdAndBooking(Long id, Booking booking);
}