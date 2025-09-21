// src/PersonalityTest.js
import React, { useState } from "react";
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
  Divider,
} from "@mui/material";

const optionScores = {
  "Strongly agree": 4,
  Agree: 3,
  Neutral: 2,
  Disagree: 1,
};

const traitsMap = {
  analytical: [0, 1],
  creative: [2, 13],
  social: [3, 4, 5, 6, 14],
};

const questions = [
  { question: "I enjoy working with numbers and logic.", options: ["Strongly agree", "Agree", "Neutral", "Disagree"] },
  { question: "I enjoy solving logical problems.", options: ["Strongly agree", "Agree", "Neutral", "Disagree"] },
  { question: "I prefer creative tasks over repetitive tasks.", options: ["Strongly agree", "Agree", "Neutral", "Disagree"] },
  { question: "I prefer working alone rather than as part of a team.", options: ["Strongly agree", "Agree", "Neutral", "Disagree"] },
  { question: "I thrive in team situations.", options: ["Strongly agree", "Agree", "Neutral", "Disagree"] },
  { question: "I am comfortable making public speeches.", options: ["Strongly agree", "Agree", "Neutral", "Disagree"] },
  { question: "I feel uneasy if I'm the center of attention.", options: ["Strongly agree", "Agree", "Neutral", "Disagree"] },
  { question: "It is very important for me to achieve my goals.", options: ["Strongly agree", "Agree", "Neutral", "Disagree"] },
  { question: "I am confident in my ability to complete difficult tasks.", options: ["Strongly agree", "Agree", "Neutral", "Disagree"] },
  { question: "I strive to be in a position of power.", options: ["Strongly agree", "Agree", "Neutral", "Disagree"] },
  { question: "I am always prepared.", options: ["Strongly agree", "Agree", "Neutral", "Disagree"] },
  { question: "I pay close attention to details.", options: ["Strongly agree", "Agree", "Neutral", "Disagree"] },
  { question: "I need little to no supervision to complete my tasks.", options: ["Strongly agree", "Agree", "Neutral", "Disagree"] },
  { question: "I enjoy expressing myself through art or writing.", options: ["Strongly agree", "Agree", "Neutral", "Disagree"] },
  { question: "I like helping others solve their problems.", options: ["Strongly agree", "Agree", "Neutral", "Disagree"] },
];

function calculateScores(answers) {
  const result = { analytical: 0, creative: 0, social: 0 };
  for (const trait in traitsMap) {
    traitsMap[trait].forEach((i) => {
      const answer = answers[i];
      if (answer) {
        result[trait] += optionScores[answer];
      }
    });
  }
  return result;
}

export default function PersonalityTest({ onComplete, goBack }) {
  const [answers, setAnswers] = useState({});

  const handleOptionChange = (qIndex, option) => {
    setAnswers((prev) => ({ ...prev, [qIndex]: option }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Object.keys(answers).length !== questions.length) {
      alert("⚠️ Please answer all questions before submitting.");
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      alert("⚠️ You must be logged in to submit the test.");
      return;
    }

    const scores = calculateScores(answers);
    const data = {
      userId: user.uid,
      answers,
      scores,
      timestamp: serverTimestamp(),
    };

    try {
      await addDoc(collection(db, "personality_test_responses"), data);
      onComplete(scores);
    } catch (error) {
      console.error("Error saving results: ", error);
      alert("Error saving results: " + error.message);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Box component="form" onSubmit={handleSubmit}>
        <Typography variant="h4" gutterBottom>
          Personality Test
        </Typography>

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
          Submit Personality Test
        </Button>

        {goBack && (
          <Button
            type="button"
            onClick={goBack}
            color="secondary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Logout
          </Button>
        )}
      </Box>
    </Container>
  );
}
