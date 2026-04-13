package com.receivly.receivly_backend.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.util.HtmlUtils;

import java.util.Base64;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class ResendEmailService {

    private final RestClient restClient;
    private final String fromEmail;

    public ResendEmailService(
            @Value("${app.resend.api-key}") String apiKey,
            @Value("${app.resend.from-email}") String fromEmail) {
        this.fromEmail = fromEmail;
        this.restClient = RestClient.builder()
                .baseUrl("https://api.resend.com")
                .defaultHeader("Authorization", "Bearer " + apiKey)
                .build();
    }

    public void sendInvoice(String toEmail, String invoiceNumber, byte[] pdfBytes, String fileName) {
        String base64Content = Base64.getEncoder().encodeToString(pdfBytes);

        Map<String, Object> body = Map.of(
                "from", fromEmail,
                "to", List.of(toEmail),
                "subject", "Invoice " + HtmlUtils.htmlEscape(invoiceNumber),
                "html", buildEmailHtml(invoiceNumber),
                "attachments", List.of(Map.of(
                        "filename", fileName,
                        "content", base64Content
                ))
        );

        try {
            restClient.post()
                    .uri("/emails")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(body)
                    .retrieve()
                    .toBodilessEntity();
            log.info("Invoice {} sent to {} via Resend", invoiceNumber, toEmail);
        } catch (RestClientException e) {
            log.error("Resend API error sending invoice {}: {}", invoiceNumber, e.getMessage());
            throw new IllegalArgumentException("Failed to send email. Please try again.");
        }
    }

    private String buildEmailHtml(String invoiceNumber) {
        String escaped = HtmlUtils.htmlEscape(invoiceNumber);
        return """
                <div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:0 auto;background:#ffffff;padding:40px 32px;">
                  <h1 style="font-size:22px;font-weight:700;color:#111827;margin:0 0 8px;">Invoice %s</h1>
                  <p style="color:#6b7280;font-size:15px;margin:0 0 24px;">Please find your invoice attached to this email.</p>
                  <p style="color:#6b7280;font-size:15px;margin:0 0 32px;">Thank you for your business!</p>
                  <hr style="border:none;border-top:1px solid #e5e7eb;margin:0 0 24px;">
                  <p style="color:#9ca3af;font-size:12px;margin:0;">
                    Sent via <a href="https://getreceivly.com" style="color:#059669;text-decoration:none;">Receivly</a>
                  </p>
                </div>
                """.formatted(escaped);
    }
}
