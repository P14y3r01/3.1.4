package test.kata.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import test.kata.model.Role;
import test.kata.model.User;
import test.kata.service.UserService;

import javax.validation.Valid;
import java.security.Principal;
import java.util.List;
import java.util.Set;


// 5. В Рест Контроллере  ResponseEntity
@CrossOrigin(origins = "http://localhost:8080")
@RestController
@RequestMapping("/api")
public class RestAdminPage {

    private UserService userService;

    @Autowired
    public RestAdminPage (UserService userService) { this.userService=userService;}

    @GetMapping("/admin/adminpanels")
    public ResponseEntity<List <User>> findAll() {
        return  new ResponseEntity<>(userService.all()  , HttpStatus.OK);
    }

    @GetMapping("/admin/adminpanel")
    public ResponseEntity<User> getUserByUsername (Principal principal) {
        User user = userService.findByUsername(principal.getName());
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @GetMapping("/admin/adminpanels/{id}")
    public ResponseEntity<User> getUserById(@PathVariable("id") Long id) {
        User user = userService.getUserById(id);
        return new ResponseEntity<>(user, HttpStatus.OK);    }





    @PostMapping("/admin/adminpanels")
    public ResponseEntity<?> NewUser(@Valid @RequestBody User user) {
            userService.save(user);
            return new ResponseEntity<>(HttpStatus.OK);
    }

    @PutMapping("/admin/adminpanels/{id}")
    public ResponseEntity<?> editUser(@PathVariable("id") long id, @Valid @RequestBody  User user) {
            userService.update(user);
            return new ResponseEntity<>(HttpStatus.OK);

    }

    @DeleteMapping("/admin/adminpanels/{id}")
    public ResponseEntity<?> delete (@PathVariable("id") long id) {
        userService.delete(id);
        return new ResponseEntity<>(HttpStatus.OK);

    }






}
