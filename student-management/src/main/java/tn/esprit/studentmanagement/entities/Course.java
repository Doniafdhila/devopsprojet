package tn.esprit.studentmanagement.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString(exclude = {"enrollments"})
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idCourse;
    private String name;
    private String code;           // exemple : CS101
    private int credit;            // nombre de crédits
    private String description;

    @JsonIgnore
    @OneToMany(mappedBy = "course")
    private List<Enrollment> enrollments;

}
