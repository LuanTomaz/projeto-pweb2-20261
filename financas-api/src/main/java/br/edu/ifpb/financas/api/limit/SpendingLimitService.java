package br.edu.ifpb.financas.api.limit;

import br.edu.ifpb.financas.api.category.Category;
import br.edu.ifpb.financas.api.category.CategoryRepository;
import br.edu.ifpb.financas.api.user.AppUser;
import br.edu.ifpb.financas.api.user.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class SpendingLimitService {

    private final SpendingLimitRepository spendingLimitRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    public List<SpendingLimitResponse> listLimits(String username) {
        AppUser user = findUser(username);
        return spendingLimitRepository.findByUser(user).stream()
                .map(SpendingLimitResponse::from)
                .toList();
    }

    public SpendingLimitResponse createLimit(String username, CreateSpendingLimitRequest request) {
        AppUser user = findUser(username);
        Category category = categoryRepository.findById(request.categoryId())
                .orElseThrow(() -> new EntityNotFoundException("Categoria não encontrada"));

        SpendingLimit entity = SpendingLimit.builder()
                .user(user)
                .category(category)
                .limitAmount(request.limitAmount())
                .period(request.period())
                .build();

        return SpendingLimitResponse.from(spendingLimitRepository.save(entity));
    }

    public void deleteLimit(String username, Long id) {
        SpendingLimit limit = spendingLimitRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Limite não encontrado"));

        if (!limit.getUser().getUsername().equals(username)) {
            throw new AccessDeniedException("Acesso negado");
        }

        spendingLimitRepository.delete(limit);
    }

    private AppUser findUser(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado"));
    }
}
