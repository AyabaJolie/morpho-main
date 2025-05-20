import { useState } from 'react';
import { motion } from 'framer-motion';
import { ErrorAlert } from '../../components/ErrorAlert';
import { MeasurementInput } from '../../components/MeasurementInput';
import { MeasurementsChart } from '../../components/MeasurementsChart';
import { AnalysisResult } from '../../components/AnalysisResult';
import { analyzeMeasurements } from '../../services/api';
import { Measurements, AnalysisResult as AnalysisResultType } from '../../types';

export const MeasurementsPage = () => {
  const [measurements, setMeasurements] = useState<Measurements>({
    bust: 0,
    waist: 0,
    hips: 0
  });
  const [result, setResult] = useState<AnalysisResultType | null>(null);
  const [error, setError] = useState<string>('');

  const handleAnalyze = async () => {
    try {
      const analysisResult = await analyzeMeasurements(measurements);
      setResult(analysisResult);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
    }
  };

  return (
    <div className="p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Vos mesures
            </h2>
            <p className="text-gray-600 mt-2">Entrez vos mesures pour découvrir votre type morphologique</p>
          </div>

          <ErrorAlert message={error} />
          
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <MeasurementInput
                label="Buste (cm)"
                value={measurements.bust}
                onChange={(value) => setMeasurements({ ...measurements, bust: value })}
                placeholder="90"
              />

              <MeasurementInput
                label="Taille (cm)"
                value={measurements.waist}
                onChange={(value) => setMeasurements({ ...measurements, waist: value })}
                placeholder="70"
              />

              <MeasurementInput
                label="Hanche (cm)"
                value={measurements.hips}
                onChange={(value) => setMeasurements({ ...measurements, hips: value })}
                placeholder="95"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAnalyze}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-4 rounded-lg hover:from-purple-700 hover:to-pink-700 transition duration-200 shadow-lg hover:shadow-xl"
            >
              Analyser
            </motion.button>

            {measurements.bust > 0 && measurements.waist > 0 && measurements.hips > 0 && (
              <MeasurementsChart measurements={measurements} />
            )}
          </div>
        </div>

        {result && <AnalysisResult result={result} />}
      </motion.div>
    </div>
  );
}; 