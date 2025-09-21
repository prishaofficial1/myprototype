// src/AptitudeTest.js
import React, { useState, useEffect, useRef } from "react";
import { auth, db } from "./firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import {
  Container,
  Box,
  Typography,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  Button,
} from "@mui/material";

const questions = [
  {
    question: "If the ratio of boys to girls in a class is 3:4 and there are 21 boys, how many girls are there?",
    options: ["28", "25", "30", "35"],
    answer: "28",
  },
  {
    question: "What is the next number in the series: 2, 6, 12, 20, 30, ?",
    options: ["40", "42", "38", "36"],
    answer: "42",
  },
  {
    question: "Solve: 5x - 3 = 2x + 12. What is x?",
    options: ["3", "5", "7", "9"],
    answer: "5",
  },
  {
    question: "The area of a circle is 154 cm². Find its radius (π = 22/7).",
    options: ["7 cm", "14 cm", "11 cm", "21 cm"],
    answer: "7 cm",
  },
  {
    question: "A train travels 60 km in 45 minutes. What is its speed in km/h?",
    options: ["60 km/h", "80 km/h", "90 km/h", "120 km/h"],
    answer: "80 km/h",
  },
];

const TIME_LIMIT = 60; // seconds

export default function AptitudeTest({ goBack, personalityScores, goToLogin }) {
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const timerId = useRef(null);

  useEffect(() => {
    timerId.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerId.current);
          handleSubmit(); // Auto-submit on time up
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timerId.current);
  }, []);

  const handleOptionChange = (qIndex, option) => {
    setAnswers((prev) => ({ ...prev, [qIndex]: option }));
  };

  const handleSubmit = async () => {
    clearInterval(timerId.current);

    const user = auth.currentUser;
    if (!user) {
      alert("⚠️ You must be logged in to submit the test.");
      return;
    }

    // Calculate score
    let calculatedScore = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.answer) calculatedScore++;
    });

    setScore(calculatedScore);
    setShowResults(true);

    // Save data to Firestore
    try {
      await addDoc(collection(db, "aptitude_test_responses"), {
        userId: user.uid,
        answers,
        score: calculatedScore,
        timestamp: serverTimestamp(),
        personalityScores,
      });
    } catch (error) {
      console.error("Error saving aptitude test results:", error);
      alert("Error saving results: " + error.message);
    }
  };

  if (showResults) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Aptitude Test Results
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          You scored {score} out of {questions.length}.
        </Typography>

        <Typography variant="h6" sx={{ mt: 3 }}>
          Recommended Career Paths:
        </Typography>
        <ul>
          {getCareerRecommendations(personalityScores).map((career, idx) => (
            <li key={idx}>{career}</li>
          ))}
        </ul>

        <Box sx={{ mt: 3 }}>
          <Button variant="outlined" onClick={() => window.location.reload()}>
            Restart App
          </Button>

          <Button
            variant="contained"
            color="secondary"
            sx={{ ml: 2 }}
            onClick={goToLogin}
          >
            Logout
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Timed Aptitude Test
      </Typography>
      <Typography variant="subtitle1" color="error" gutterBottom>
        Time left: {timeLeft} seconds
      </Typography>

      <Box component="form" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
        {questions.map((q, i) => (
          <Box key={i} sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              {i + 1}. {q.question}
            </Typography>
            <FormControl component="fieldset">
              <RadioGroup
                value={answers[i] || ""}
                onChange={(e) => handleOptionChange(i, e.target.value)}
              >
                {q.options.map((opt) => (
                  <FormControlLabel
                    key={opt}
                    value={opt}
                    control={<Radio />}
                    label={opt}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </Box>
        ))}

        <Button type="submit" variant="contained" fullWidth sx={{ mt: 3 }}>
          Submit Aptitude Test
        </Button>

        <Button
          type="button"
          onClick={goBack}
          color="secondary"
          fullWidth
          sx={{ mt: 2 }}
        >
          Back to Personality Test
        </Button>
      </Box>
    </Container>
  );
}

// Helper function (same as in PersonalityTest)
const getCareerRecommendations = (scores) => {
  if (!scores) return ["No scores available"];

  const { analytical, creative, social } = scores;
  const recommendations = [];

  if (analytical >= 7) {
    recommendations.push("Data Scientist", "Software Engineer", "Engineer");
  }
  if (creative >= 7) {
    recommendations.push("Graphic Designer", "Writer", "Artist");
  }
  if (social >= 10) {
    recommendations.push("Teacher", "Counselor", "Social Worker");
  }

  if (recommendations.length === 0) {
    recommendations.push("Explore various fields to find your interest!");
  }

  return recommendations;
};
