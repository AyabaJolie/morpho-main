import { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ErrorResponse {
  error: string;
}

interface Measurements {
  bust: number;
  waist: number;
  hips: number;
}

interface AnalysisResult {
  type: string;
  advice: string;
}

function App() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [measurements, setMeasurements] = useState<Measurements>({
    bust: 0,
    waist: 0,
    hips: 0
  });
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string>('');

  const handleRegister = async () => {
    try {
      await axios.post('http://localhost:3001/register', { email, password });
      alert('Registered successfully!');
    } catch (err) {
      const error = err as AxiosError<ErrorResponse>;
      setError(error.response?.data?.error || 'Registration failed');
    }
  };

  const handleLogin = async () => {
    try {
      const res = await axios.post<{ token: string }>('http://localhost:3001/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userEmail', email);
      setLoggedIn(true);
      setError('');
    } catch (err) {
      const error = err as AxiosError<ErrorResponse>;
      setError(error.response?.data?.error || 'Login failed');
    }
  };

  const analyzeMeasurements = (measurements: Measurements): AnalysisResult => {
    const { bust, waist, hips } = measurements;
    
    // Calcul des ratios
    const waistToHipRatio = waist / hips;
    const bustToHipRatio = bust / hips;
    
    // Détermination du type morphologique
    let type = '';
    let advice = '';

    if (bust > hips) {
      type = 'Type V (Triangle inversé)';
      advice = `Votre silhouette présente des épaules plus larges que les hanches.
      
Conseils vestimentaires :
• Privilégiez les hauts simples et les décolletés en V
• Évitez les épaules marquées et les manches volumineuses
• Portez des pantalons droits ou légèrement évasés
• Ajoutez du volume en bas avec des jupes plissées ou des pantalons à pinces

Programme d'entraînement recommandé :
• Cardio : 3-4 fois par semaine
  - Course à pied ou vélo : 30-45 minutes
  - Natation : 45 minutes
  - Évitez les sports sollicitant beaucoup les épaules

• Renforcement musculaire :
  - Squats : 3 séries de 15 répétitions
  - Fentes : 3 séries de 12 répétitions par jambe
  - Soulevé de terre : 3 séries de 10 répétitions
  - Leg press : 3 séries de 12 répétitions
  - Extensions de hanches : 3 séries de 15 répétitions

• Étirements :
  - Étirements des épaules et du dos
  - Yoga ou Pilates 2 fois par semaine
  - Focus sur la mobilité des hanches

Conseils alimentaires :
• Privilégiez les protéines maigres (poulet, poisson, légumineuses)
• Consommez des glucides complexes (riz complet, quinoa, patates douces)
• Ajoutez des graisses saines (avocat, noix, huile d'olive)
• Mangez 5-6 petits repas par jour pour maintenir la masse musculaire
• Hydratez-vous bien (2-3L d'eau par jour)
• Limitez les sucres raffinés et l'alcool`;
    } else if (hips > bust && waistToHipRatio > 0.8) {
      type = 'Type A (Triangle)';
      advice = `Votre silhouette présente des hanches plus larges que les épaules.
      
Conseils vestimentaires :
• Mettez l'accent sur le haut du corps avec des détails
• Portez des hauts avec des manches volumineuses
• Choisissez des pantalons droits ou légèrement fuselés
• Évitez les jupes trop moulantes ou les pantalons à taille basse

Programme d'entraînement recommandé :
• Cardio : 4-5 fois par semaine
  - HIIT : 20-30 minutes
  - Course à pied : 30-45 minutes
  - Vélo elliptique : 45 minutes

• Renforcement musculaire :
  - Développé couché : 3 séries de 12 répétitions
  - Tirage vertical : 3 séries de 12 répétitions
  - Élévations latérales : 3 séries de 15 répétitions
  - Rowing : 3 séries de 12 répétitions
  - Pompes : 3 séries de 10-15 répétitions

• Étirements :
  - Étirements des hanches et des jambes
  - Yoga dynamique 2-3 fois par semaine
  - Focus sur la mobilité des épaules

Conseils alimentaires :
• Augmentez l'apport en protéines (1.6-2g par kg de poids)
• Réduisez les glucides simples (pain blanc, pâtes blanches)
• Consommez des fibres (légumes, fruits, céréales complètes)
• Mangez des graisses saines (poissons gras, noix)
• Évitez les aliments transformés et le sucre
• Buvez du thé vert pour stimuler le métabolisme`;
    } else if (Math.abs(bust - hips) < 5 && waistToHipRatio > 0.8) {
      type = 'Type H (Rectangle)';
      advice = `Votre silhouette présente des proportions équilibrées.
      
Conseils vestimentaires :
• Créez des courbes avec des ceintures et des détails
• Portez des vêtements structurés
• Ajoutez des détails au niveau de la taille
• Évitez les vêtements trop amples ou trop moulants

Programme d'entraînement recommandé :
• Cardio : 3-4 fois par semaine
  - Course à pied : 30-45 minutes
  - Natation : 45 minutes
  - HIIT : 20-30 minutes

• Renforcement musculaire :
  - Crunchs : 3 séries de 20 répétitions
  - Planche : 3 séries de 30 secondes
  - Squats : 3 séries de 15 répétitions
  - Développé couché : 3 séries de 12 répétitions
  - Soulevé de terre : 3 séries de 10 répétitions

• Étirements :
  - Yoga ou Pilates 2-3 fois par semaine
  - Étirements complets du corps
  - Focus sur la posture

Conseils alimentaires :
• Maintenez un équilibre protéines/glucides/graisses (30/40/30)
• Consommez des aliments riches en fibres
• Mangez des protéines à chaque repas
• Privilégiez les aliments à index glycémique bas
• Hydratez-vous régulièrement
• Évitez les grignotages entre les repas`;
    } else if (waistToHipRatio < 0.8) {
      type = 'Type X (Sablier)';
      advice = `Votre silhouette présente une taille bien marquée.
      
Conseils vestimentaires :
• Mettez en valeur votre taille avec des ceintures
• Portez des vêtements cintrés à la taille
• Choisissez des robes et tops ajustés
• Évitez les vêtements trop amples ou sans forme

Programme d'entraînement recommandé :
• Cardio : 3-4 fois par semaine
  - Danse : 45-60 minutes
  - Natation : 45 minutes
  - Course à pied : 30 minutes

• Renforcement musculaire :
  - Crunchs obliques : 3 séries de 15 répétitions
  - Planche latérale : 3 séries de 30 secondes
  - Squats : 3 séries de 12 répétitions
  - Fentes : 3 séries de 10 répétitions par jambe
  - Élévations de hanches : 3 séries de 15 répétitions

• Étirements :
  - Yoga ou Pilates 2-3 fois par semaine
  - Étirements de la taille et du dos
  - Focus sur la mobilité du bassin

Conseils alimentaires :
• Maintenez un apport équilibré en macronutriments
• Consommez des protéines maigres
• Privilégiez les glucides complexes
• Mangez des graisses saines en quantité modérée
• Buvez beaucoup d'eau (2-3L par jour)
• Évitez les aliments transformés et le sucre`;
    } else {
      type = 'Type O (Rond)';
      advice = `Votre silhouette présente des courbes douces.
      
Conseils vestimentaires :
• Créez des lignes verticales avec les vêtements
• Portez des vêtements structurés
• Choisissez des matières fluides
• Évitez les vêtements trop moulants

Programme d'entraînement recommandé :
• Cardio : 4-5 fois par semaine
  - Marche rapide : 45-60 minutes
  - Natation : 45 minutes
  - Vélo : 30-45 minutes
  - HIIT : 20-30 minutes

• Renforcement musculaire :
  - Squats : 3 séries de 15 répétitions
  - Fentes : 3 séries de 12 répétitions par jambe
  - Planche : 3 séries de 30 secondes
  - Pompes : 3 séries de 10 répétitions
  - Rowing : 3 séries de 12 répétitions

• Étirements :
  - Yoga doux 2-3 fois par semaine
  - Étirements complets du corps
  - Focus sur la respiration et la posture

Conseils alimentaires :
• Réduisez l'apport en glucides simples
• Augmentez la consommation de protéines maigres
• Mangez beaucoup de légumes et fruits
• Évitez les graisses saturées et le sucre
• Buvez de l'eau avant chaque repas
• Mangez lentement et mastiquez bien`;
    }

    return { type, advice };
  };

  const handleAnalyze = async () => {
    try {
      const token = localStorage.getItem('token');
      const analysisResult = analyzeMeasurements(measurements);
      setResult(analysisResult);
      setError('');
    } catch (err) {
      const error = err as AxiosError<ErrorResponse>;
      setError(error.response?.data?.error || 'Analysis failed');
    }
  };

  const getUserName = (email: string | null) => {
    if (!email) return 'Invité';
    return email.split('@')[0];
  };

  const chartData = {
    labels: ['Buste', 'Taille', 'Hanche'],
    datasets: [
      {
        label: 'Mesures (cm)',
        data: [measurements.bust, measurements.waist, measurements.hips],
        borderColor: 'rgb(75, 85, 199)',
        backgroundColor: 'rgba(75, 85, 199, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const barChartData = {
    labels: ['Buste', 'Taille', 'Hanche'],
    datasets: [
      {
        label: 'Proportions (%)',
        data: [
          (measurements.bust / measurements.hips) * 100,
          (measurements.waist / measurements.hips) * 100,
          100,
        ],
        backgroundColor: [
          'rgba(75, 85, 199, 0.8)',
          'rgba(75, 85, 199, 0.6)',
          'rgba(75, 85, 199, 0.4)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            size: 14,
            family: 'Inter',
          },
        },
      },
      title: {
        display: true,
        text: 'Vos mesures en centimètres',
        font: {
          size: 16,
          family: 'Inter',
          weight: 'bold' as const,
        },
        padding: 20,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          font: {
            family: 'Inter',
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            family: 'Inter',
          },
        },
      },
    },
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            size: 14,
            family: 'Inter',
          },
        },
      },
      title: {
        display: true,
        text: 'Proportions corporelles',
        font: {
          size: 16,
          family: 'Inter',
          weight: 'bold' as const,
        },
        padding: 20,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          font: {
            family: 'Inter',
          },
          callback: function(value: number | string) {
            return `${value}%`;
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            family: 'Inter',
          },
        },
      },
    },
  };

  const downloadPDF = () => {
    if (!result || !measurements) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Titre
    doc.setFontSize(20);
    doc.text('Analyse Morphologique', pageWidth / 2, 20, { align: 'center' });
    
    // Type morphologique
    doc.setFontSize(16);
    doc.text(`Type: ${result.type}`, 20, 40);
    
    // Mesures
    doc.setFontSize(14);
    doc.text('Mesures:', 20, 60);
    doc.setFontSize(12);
    doc.text(`Buste: ${measurements.bust} cm`, 30, 70);
    doc.text(`Taille: ${measurements.waist} cm`, 30, 80);
    doc.text(`Hanche: ${measurements.hips} cm`, 30, 90);
    
    // Conseils
    doc.setFontSize(14);
    doc.text('Conseils:', 20, 110);
    doc.setFontSize(12);
    
    const splitAdvice = doc.splitTextToSize(result.advice, pageWidth - 40);
    doc.text(splitAdvice, 20, 120);
    
    // Pied de page
    doc.setFontSize(10);
    doc.text(`Généré le ${new Date().toLocaleDateString()}`, pageWidth / 2, 280, { align: 'center' });
    
    doc.save('analyse-morphologique.pdf');
  };

  const downloadExcel = () => {
    if (!result || !measurements) return;

    const data = [
      ['Analyse Morphologique'],
      [''],
      ['Type Morphologique', result.type],
      [''],
      ['Mesures'],
      ['Buste', `${measurements.bust} cm`],
      ['Taille', `${measurements.waist} cm`],
      ['Hanche', `${measurements.hips} cm`],
      [''],
      ['Conseils'],
      [result.advice],
    ];

    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Analyse');
    XLSX.writeFile(wb, 'analyse-morphologique.xlsx');
  };

  if (!loggedIn) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-full max-w-md space-y-6 p-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800">
              MorphoConseil
            </h1>
            <p className="text-gray-600 mt-2">Découvrez votre type morphologique</p>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border-b border-gray-300 focus:ring-0 focus:border-gray-500 focus:outline-none"
                placeholder="votre@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border-b border-gray-300 focus:ring-0 focus:border-gray-500 focus:outline-none"
                placeholder="••••••••"
              />
            </div>

            <div className="flex space-x-4 pt-4">
              <button
                onClick={handleRegister}
                className="flex-1 bg-gray-800 text-white py-2 px-4 hover:bg-gray-700 transition duration-200"
              >
                S'inscrire
              </button>
              <button
                onClick={handleLogin}
                className="flex-1 bg-gray-600 text-white py-2 px-4 hover:bg-gray-500 transition duration-200"
              >
                Se connecter
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 py-3 px-4">
        <div className="flex items-center space-x-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="text-sm text-gray-600">
            {getUserName(localStorage.getItem('userEmail'))}
          </span>
        </div>
      </header>

      <div className="p-8 pt-20 pb-24">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800">
                Vos mesures
              </h2>
              <p className="text-gray-600 mt-2">Entrez vos mesures pour découvrir votre type morphologique</p>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                <p className="text-red-700">{error}</p>
              </div>
            )}
            
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Buste (cm)</label>
                  <input
                    type="number"
                    value={measurements.bust}
                    onChange={(e) =>
                      setMeasurements({ ...measurements, bust: Number(e.target.value) })
                    }
                    className="w-full px-4 py-2 border-b border-gray-300 focus:ring-0 focus:border-gray-500 focus:outline-none"
                    placeholder="90"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Taille (cm)</label>
                  <input
                    type="number"
                    value={measurements.waist}
                    onChange={(e) =>
                      setMeasurements({ ...measurements, waist: Number(e.target.value) })
                    }
                    className="w-full px-4 py-2 border-b border-gray-300 focus:ring-0 focus:border-gray-500 focus:outline-none"
                    placeholder="70"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Hanche (cm)</label>
                  <input
                    type="number"
                    value={measurements.hips}
                    onChange={(e) =>
                      setMeasurements({ ...measurements, hips: Number(e.target.value) })
                    }
                    className="w-full px-4 py-2 border-b border-gray-300 focus:ring-0 focus:border-gray-500 focus:outline-none"
                    placeholder="95"
                  />
                </div>
              </div>

              <button
                onClick={handleAnalyze}
                className="w-full bg-gray-800 text-white py-3 px-4 hover:bg-gray-700 transition duration-200"
              >
                Analyser
              </button>

              {measurements.bust > 0 && measurements.waist > 0 && measurements.hips > 0 && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                    <div className="h-[400px]">
                      <Line data={chartData} options={chartOptions} />
                    </div>
                    <div className="h-[400px]">
                      <Bar data={barChartData} options={barChartOptions} />
                    </div>
                  </div>
                  <div className="mt-8 flex justify-center space-x-4">
                    <button
                      onClick={downloadPDF}
                      className="flex items-center space-x-2 bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 transition duration-200"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span>Télécharger PDF</span>
                    </button>
                    <button
                      onClick={downloadExcel}
                      className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-500 transition duration-200"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span>Télécharger Excel</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {result && (
            <div className="mt-12 bg-gradient-to-br from-gray-50 to-white rounded-lg p-8">
              <div className="max-w-3xl mx-auto">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-800">
                    {result.type}
                  </h3>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="flex items-start space-x-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-2">Conseils personnalisés</h4>
                      <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                        {result.advice}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="text-sm font-medium text-gray-500 mb-1">Buste</div>
                    <div className="text-2xl font-bold text-gray-800">{measurements.bust} cm</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="text-sm font-medium text-gray-500 mb-1">Taille</div>
                    <div className="text-2xl font-bold text-gray-800">{measurements.waist} cm</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="text-sm font-medium text-gray-500 mb-1">Hanche</div>
                    <div className="text-2xl font-bold text-gray-800">{measurements.hips} cm</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-4">
        <div className="container mx-auto px-4">
          <div className="text-center text-sm text-gray-600">
            <p>MorphoConseil © {new Date().getFullYear()}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;