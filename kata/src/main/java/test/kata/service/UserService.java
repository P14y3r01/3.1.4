package test.kata.service;

import org.springframework.security.core.userdetails.UserDetails;
import test.kata.model.Role;
import test.kata.model.User;

import java.util.List;
import java.util.Set;

public interface UserService {
    void save(User user);
    void delete(long id);
    User getUserById(long id);
    List<User> all();
    List<Role> listRoles();
    User findByUsername(String username);
    void update(User user);
    User passwordCoder(User user);
//    void update (User user);
}
