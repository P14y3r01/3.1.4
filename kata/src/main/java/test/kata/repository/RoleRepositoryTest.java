package test.kata.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.stereotype.Repository;
import test.kata.model.Role;


public interface RoleRepositoryTest extends JpaRepository<Role, Long> {
}
