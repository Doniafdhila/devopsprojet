package tn.esprit.studentmanagement.controllers;

import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;
import tn.esprit.studentmanagement.entities.Course;
import tn.esprit.studentmanagement.services.ICourseService;

import java.util.List;

@RestController
@RequestMapping("/courses")
@CrossOrigin(origins = "http://localhost:4200")
@AllArgsConstructor
public class CourseController {
    ICourseService courseService;

    @GetMapping("/getAllCourses")
    public List<Course> getAllCourses() { return courseService.getAllCourses(); }

    @GetMapping("/getCourse/{id}")
    public Course getCourse(@PathVariable Long id) { return courseService.getCourseById(id); }

    @PostMapping("/createCourse")
    public Course createCourse(@RequestBody Course course) { return courseService.saveCourse(course); }

    @PutMapping("/updateCourse")
    public Course updateCourse(@RequestBody Course course) { return courseService.saveCourse(course); }

    @DeleteMapping("/deleteCourse/{id}")
    public void deleteCourse(@PathVariable Long id) { courseService.deleteCourse(id); }
}
