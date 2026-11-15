package com.vietninie.enums;

import com.vietninie.exception.BadRequestException;

/** Learning direction: ZH = Vietnamese speakers learning Chinese, VI = Chinese speakers learning Vietnamese. */
public enum Direction {
    ZH,
    VI;

    public static Direction fromCode(String code) {
        if (code == null) {
            throw new BadRequestException("Hướng học không hợp lệ (zh | vi)");
        }
        return switch (code.trim().toLowerCase()) {
            case "zh" -> ZH;
            case "vi" -> VI;
            default -> throw new BadRequestException("Hướng học không hợp lệ (zh | vi)");
        };
    }
}
