package test.kata.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import test.kata.model.User;


public interface UserRepositoryTest extends JpaRepository<User, Long> {
    @Query("select u FROM User u join fetch u.roles where u.username =:username")
    User findByUsername(String username);
}
