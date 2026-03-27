package com.example.notesbook.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.notesbook.entity.Note;
import com.example.notesbook.entity.User;
import com.example.notesbook.repository.NoteRepository;
import com.example.notesbook.repository.UserRepository;

@RestController
@RequestMapping("/api/notes")
public class NotesController {

    @Autowired
    private NoteRepository noteRepository;

    @Autowired
    private UserRepository userRepository;

    // Create note
    @PostMapping("/create")
    public ResponseEntity<?> createNote(@RequestBody Note note, Authentication auth) {
        User user = (User) auth.getPrincipal();
        note.setUser(user);
        note.setCreatedAt(LocalDateTime.now());
        note.setUpdatedAt(LocalDateTime.now());
        noteRepository.save(note);
        return ResponseEntity.ok(note);
    }

    // Get all notes for logged-in user
    @GetMapping
    public List<Note> getNotes(Authentication auth) {
        User user = (User) auth.getPrincipal();
        return noteRepository.findByUserId(user.getId());
    }

    // Update note
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateNote(@PathVariable Long id, @RequestBody Note noteDetails, Authentication auth) {
        User user = (User) auth.getPrincipal();
        Optional<Note> noteOpt = noteRepository.findById(id);
        if(noteOpt.isEmpty() || !noteOpt.get().getUser().getId().equals(user.getId())){
            return ResponseEntity.status(403).body("Not authorized");
        }

        Note note = noteOpt.get();
        note.setTitle(noteDetails.getTitle());
        note.setContent(noteDetails.getContent());
        note.setUpdatedAt(LocalDateTime.now());
        noteRepository.save(note);

        return ResponseEntity.ok(note);
    }

    // Delete note
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteNote(@PathVariable Long id, Authentication auth) {
        User user = (User) auth.getPrincipal();
        Optional<Note> noteOpt = noteRepository.findById(id);
        if(noteOpt.isEmpty() || !noteOpt.get().getUser().getId().equals(user.getId())){
            return ResponseEntity.status(403).body("Not authorized");
        }

        noteRepository.delete(noteOpt.get());
        return ResponseEntity.ok("Note deleted successfully");
    }
}