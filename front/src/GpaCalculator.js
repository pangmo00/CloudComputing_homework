import React, { useState, useEffect } from 'react';
import { PlusCircle, Trash2 } from 'lucide-react';

const GPACalculator = () => {
  const [semesters, setSemesters] = useState(() => {
    const savedData = localStorage.getItem('semesters');
    return savedData
      ? JSON.parse(savedData)
      : [{ id: 1, name: '2024년 1학기', subjects: [{ name: '', credit: '', score: '' }] }];
  });

  useEffect(() => {
    localStorage.setItem('semesters', JSON.stringify(semesters));
  }, [semesters]);

  const addSemester = () => {
    const newSemester = {
      id: semesters.length + 1,
      name: '',
      subjects: [{ name: '', credit: '', score: '' }],
    };
    setSemesters([...semesters, newSemester]);
  };

  const updateSemesterName = (id, name) => {
    setSemesters(
      semesters.map(s => (s.id === id ? { ...s, name } : s))
    );
  };

  const addSubject = (id) => {
    setSemesters(
      semesters.map(s =>
        s.id === id
          ? { ...s, subjects: [...s.subjects, { name: '', credit: '', score: '' }] }
          : s
      )
    );
  };

  const handleInputChange = (semesterId, subjectIndex, field, value) => {
    setSemesters(
      semesters.map(s => {
        if (s.id !== semesterId) return s;
        const updatedSubjects = [...s.subjects];
        updatedSubjects[subjectIndex][field] = value;
        return { ...s, subjects: updatedSubjects };
      })
    );
  };

  const resetData = () => {
    localStorage.removeItem('semesters');
    setSemesters([{ id: 1, name: '', subjects: [{ name: '', credit: '', score: '' }] }]);
  };

  const calculateGPA = (semester) => {
    const totalCredits = semester.subjects.reduce((acc, subj) => acc + (parseFloat(subj.credit) || 0), 0);
    const totalPoints = semester.subjects.reduce((acc, subj) => {
      const c = parseFloat(subj.credit) || 0;
      const s = parseFloat(subj.score) || 0;
      return acc + c * s;
    }, 0);
    return totalCredits ? (totalPoints / totalCredits).toFixed(2) : '0.00';
  };

  const totalCreditsTaken = () => {
    return semesters.reduce((acc, s) =>
      acc + s.subjects.reduce((sum, subj) => sum + (parseFloat(subj.credit) || 0), 0)
    , 0);
  };

  const overallGPA = () => {
    let totalCredits = 0;
    let totalPoints = 0;
    semesters.forEach(s => {
      s.subjects.forEach(subj => {
        const c = parseFloat(subj.credit) || 0;
        const s = parseFloat(subj.score) || 0;
        totalCredits += c;
        totalPoints += c * s;
      });
    });
    return totalCredits ? (totalPoints / totalCredits).toFixed(2) : '0.00';
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="text-center py-4 text-2xl font-bold bg-white shadow">학점 계산기</header>
      <div className="flex justify-center p-8">
        <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-3xl">
          {semesters.map((s) => (
            <div key={s.id} className="mb-6">
              <input
                type="text"
                value={s.name}
                onChange={(e) => updateSemesterName(s.id, e.target.value)}
                placeholder="학기 이름"
                className="border rounded-lg px-4 py-2 mb-2 w-full"
              />
              {s.subjects.map((subj, i) => (
                <div key={i} className="grid grid-cols-3 gap-4 mb-2">
                  <input
                    type="text"
                    placeholder="과목명"
                    value={subj.name}
                    onChange={(e) => handleInputChange(s.id, i, 'name', e.target.value)}
                    className="border rounded-lg px-4 py-2"
                  />
                  <input
                    type="text"
                    placeholder="학점"
                    value={subj.credit}
                    onChange={(e) => handleInputChange(s.id, i, 'credit', e.target.value)}
                    className="border rounded-lg px-4 py-2"
                  />
                  <input
                    type="text"
                    placeholder="성적"
                    value={subj.score}
                    onChange={(e) => handleInputChange(s.id, i, 'score', e.target.value)}
                    className="border rounded-lg px-4 py-2"
                  />
                </div>
              ))}
              <button
                onClick={() => addSubject(s.id)}
                className="flex items-center bg-blue-500 text-white rounded-lg px-4 py-2 mb-2"
              >
                <PlusCircle className="mr-2" /> 과목 추가
              </button>
              <div className="text-sm text-gray-600">
                학점: {s.subjects.reduce((sum, subj) => sum + (parseFloat(subj.credit) || 0), 0)} / 평균: {calculateGPA(s)}
              </div>
            </div>
          ))}
          <button onClick={addSemester} className="w-full bg-green-500 text-white rounded-lg px-4 py-2 mb-2">
            학기 추가
          </button>
          <button onClick={resetData} className="w-full bg-red-500 text-white rounded-lg px-4 py-2 flex justify-center items-center">
            <Trash2 className="mr-2" /> 데이터 초기화
          </button>
          <div className="mt-4 text-center font-medium text-gray-700">
            전체학점 {totalCreditsTaken()} / 전체평균 {overallGPA()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GPACalculator;