package com.vietninie.config;

import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.core.env.Profiles;
import org.springframework.stereotype.Component;

/**
 * Stops the app from running with the public dev defaults when the "prod" profile is active,
 * and warns loudly about them in every other profile.
 *
 * Production example: SPRING_PROFILES_ACTIVE=mysql,prod  plus JWT_SECRET / ADMIN_PASSWORD / DB_PASSWORD.
 */
@Component
public class SecurityDefaultsGuard {

    private static final Logger log = LoggerFactory.getLogger(SecurityDefaultsGuard.class);

    static final String DEFAULT_JWT_SECRET = "vietninie-dev-secret-change-me-please-0123456789";
    static final String DEFAULT_ADMIN_PASSWORD = "admin123";
    static final String DEFAULT_DB_PASSWORD = "vietninie123";

    private final Environment environment;
    private final String jwtSecret;
    private final String adminPassword;

    public SecurityDefaultsGuard(Environment environment,
                                 @Value("${app.jwt.secret}") String jwtSecret,
                                 @Value("${app.admin.password}") String adminPassword) {
        this.environment = environment;
        this.jwtSecret = jwtSecret;
        this.adminPassword = adminPassword;
    }

    @PostConstruct
    void check() {
        boolean prod = environment.acceptsProfiles(Profiles.of("prod"));
        StringBuilder problems = new StringBuilder();

        if (DEFAULT_JWT_SECRET.equals(jwtSecret)) {
            problems.append(" JWT_SECRET is the public default;");
        }
        if (DEFAULT_ADMIN_PASSWORD.equals(adminPassword)) {
            problems.append(" ADMIN_PASSWORD is the public default;");
        }
        if (DEFAULT_DB_PASSWORD.equals(environment.getProperty("spring.datasource.password"))) {
            problems.append(" DB_PASSWORD is the public default;");
        }
        if (problems.length() == 0) {
            return;
        }

        if (prod) {
            throw new IllegalStateException(
                    "Refusing to start with the 'prod' profile:" + problems
                            + " set JWT_SECRET, ADMIN_PASSWORD and DB_PASSWORD as environment variables.");
        }
        log.warn("INSECURE DEFAULTS (fine for local dev, never for a public server):{}", problems);
    }
}
