// app/quiz/[courseId]/page.js
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import pb from '@/lib/pocketbase';

export default function QuizPage() {
  const { courseId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [selections, setSelections] = useState({});   // { [questionId]: selectedOption }
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    async function fetchQuizzes() {
      try {
        const records = await pb.collection('quizzes').getFullList({
          filter: `course_id = "${courseId}"`,
        });
        setQuestions(records);
      } catch (err) {
        console.error('❌ Error loading quiz questions:', err);
      }
    }
    fetchQuizzes();
  }, [courseId]);

  const handleSelect = (questionId, option) => {
    setSelections(prev => ({ ...prev, [questionId]: option }));
  };

  const handleSubmit = () => {
    let correctCount = 0;
    questions.forEach(q => {
      // asegúrate de que el campo correctAnswer coincide en tipo con la opción
      if (selections[q.id] == q.correctAnswer) {
        correctCount++;
      }
    });
    setScore(correctCount);
    setSubmitted(true);
  };

  if (questions.length === 0) {
    return <p className="text-gray-500">Cargando preguntas o no hay preguntas para este curso.</p>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold">Quiz del curso</h1>

      {questions.map((q, idx) => {
        const opts = typeof q.options === 'string'
          ? JSON.parse(q.options)
          : q.options;
        const userSel = selections[q.id];

        return (
          <div key={q.id} className="p-4 border rounded-lg">
            {/* Pregunta */}
            <p className="font-semibold mb-3">
              {idx + 1}. {q.question}
            </p>

            {/* Opciones como radio buttons */}
            <ul className="space-y-2">
              {opts.map((opt, i) => {
                // determina estilos según estado
                let base = 'flex items-center gap-2 p-2 rounded cursor-pointer';
                if (submitted) {
                  if (opt == q.correctAnswer) {
                    base += ' bg-green-100 border border-green-400';
                  } else if (opt == userSel) {
                    base += ' bg-red-100 border border-red-400';
                  }
                } else if (opt == userSel) {
                  base += ' bg-gray-200';
                }

                return (
                  <li
                    key={i}
                    className={base}
                    onClick={() => !submitted && handleSelect(q.id, opt)}
                  >
                    <input
                      type="radio"
                      name={`q-${q.id}`}
                      value={opt}
                      checked={userSel === opt}
                      readOnly
                      className="form-radio"
                    />
                    <span>{opt}</span>
                  </li>
                );
              })}
            </ul>

            {/* Mensaje de acierto/fallo tras enviar */}
            {submitted && (
              <p className="mt-2 text-sm">
                {selections[q.id] == q.correctAnswer
                  ? <span className="text-green-600">✓ Correcto</span>
                  : <span className="text-red-600">✕ Incorrecto (respuesta: {q.correctAnswer})</span>
                }
              </p>
            )}
          </div>
        );
      })}

      {/* Botón de envío o resultado final */}
      <div className="text-center">
        {!submitted ? (
          <button
            onClick={handleSubmit}
            className="bg-black text-white px-6 py-2 rounded-full font-semibold hover:bg-gray-800 transition"
          >
            Enviar respuestas
          </button>
        ) : (
          <p className="text-xl font-bold">
            Has acertado {score} de {questions.length}
          </p>
        )}
      </div>
    </div>
  );
}
