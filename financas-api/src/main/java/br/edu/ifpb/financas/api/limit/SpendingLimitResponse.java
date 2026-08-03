package br.edu.ifpb.financas.api.limit;

import java.math.BigDecimal;

public record SpendingLimitResponse(
        Long id,
        Long categoryId,
        String categoryName,
        BigDecimal limitAmount,
        SpendingPeriod period) {

    public static SpendingLimitResponse from(SpendingLimit entity) {
        return new SpendingLimitResponse(
                entity.getId(),
                entity.getCategory().getId(),
                entity.getCategory().getName(),
                entity.getLimitAmount(),
                entity.getPeriod());
    }
}
