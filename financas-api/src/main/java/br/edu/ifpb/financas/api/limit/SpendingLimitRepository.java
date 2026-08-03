package br.edu.ifpb.financas.api.limit;

import br.edu.ifpb.financas.api.user.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SpendingLimitRepository extends JpaRepository<SpendingLimit, Long> {
    List<SpendingLimit> findByUser(AppUser user);
}
