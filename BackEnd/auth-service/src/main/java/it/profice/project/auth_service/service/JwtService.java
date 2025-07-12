package it.profice.project.auth_service.service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.auth0.jwt.interfaces.JWTVerifier;
import org.springframework.security.core.userdetails.UserDetails;
import it.profice.project.auth_service.security.UserDetailsImpl;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

public class JwtService {

    private static final String SECRET_KEY = "your-super-secret-key";
    private static final long EXPIRATION_TIME = 24 * 60 * 60 * 1000;

    private Algorithm getAlgorithm() {
        return Algorithm.HMAC256(SECRET_KEY);
    }

    public String generateToken(UserDetails userDetails) {
        return generateToken(new HashMap<>(), userDetails);
    }

    public String extractUsername(String token) {
        try {
            JWTVerifier verifier = JWT.require(getAlgorithm()).build();
            DecodedJWT decodedJWT = verifier.verify(token);
            return decodedJWT.getSubject();
        } catch (JWTVerificationException e) {
            return null;
        }
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username != null && username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    private boolean isTokenExpired(String token) {
        try {
            JWTVerifier verifier = JWT.require(getAlgorithm()).build();
            DecodedJWT decodedJWT = verifier.verify(token);
            return decodedJWT.getExpiresAt().before(new Date());
        } catch (JWTVerificationException e) {
            return true;
        }
    }

    public String generateToken(Map<String, Object> extraClaims, UserDetails userDetails) {
        UserDetailsImpl user = (UserDetailsImpl) userDetails;

        return JWT.create()
                .withSubject(user.getUsername())
                .withClaim("role", user.getRole())
                .withClaim("uuid", user.getUuid())
                .withIssuedAt(new Date())
                .withExpiresAt(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .sign(Algorithm.HMAC256(SECRET_KEY));
    }
}

