package test.kata.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import test.kata.model.Role;
import test.kata.model.User;
import test.kata.repository.RoleRepositoryTest;
import test.kata.repository.UserRepositoryTest;

import java.util.List;


@Service
public class UserServiceImp implements UserService {


    private final UserRepositoryTest userRepositoryTest;
    private final RoleRepositoryTest roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserServiceImp(UserRepositoryTest userRepositoryTest, RoleRepositoryTest roleRepository, PasswordEncoder passwordEncoder) {
        this.userRepositoryTest = userRepositoryTest;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public User passwordCoder(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return user;
    }



    public List<Role> listRoles() {
        return roleRepository.findAll();
    }




    @Transactional
    public void save(User user) {
        userRepositoryTest.save(passwordCoder(user));
    }



    @Transactional
    public void delete(long id) {
        userRepositoryTest.deleteById(id);
    }

    public void update(User user){
        userRepositoryTest.save(user);
    }



    public User getUserById(long id) {
        return userRepositoryTest.getOne(id);
    }


    public List<User> all() {
        return userRepositoryTest.findAll();
    }


    public User findByUsername(String username) { return userRepositoryTest.findByUsername(username);}
}
