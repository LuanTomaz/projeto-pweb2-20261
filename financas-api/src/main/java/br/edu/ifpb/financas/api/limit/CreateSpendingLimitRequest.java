package br.edu.ifpb.financas.api.limit;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record CreateSpendingLimitRequest(
        @NotNull Long categoryId,
        @NotNull @DecimalMin(value = "0.0", inclusive = false) BigDecimal limitAmount,
        @NotNull SpendingPeriod period) {
}
