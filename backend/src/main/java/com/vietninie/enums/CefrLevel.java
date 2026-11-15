package com.vietninie.enums;

import java.util.List;

public enum CefrLevel {
    A1, A2, B1, B2, C1, C2;

    public static final List<CefrLevel> ORDERED = List.of(values());

    public static CefrLevel parse(String value) {
        if (value == null) {
            return A1;
        }
        try {
            return valueOf(value.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            return A1;
        }
    }
}
