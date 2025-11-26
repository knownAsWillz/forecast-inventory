import * as tf from '@tensorflow/tfjs';

export interface ProductData {
  id: number;
  title: string;
  currentInventory: number;
  avgSalesPerWeek: number;
  daysToReplenish: number;
}

export interface PredictionResult extends ProductData {
  shouldReorder: boolean;
  confidence: number;
}

// Generate random inventory metrics for products
export function generateInventoryMetrics(products: any[]): ProductData[] {
  return products.map((product) => ({
    id: product.id,
    title: product.title,
    currentInventory: Math.floor(Math.random() * (200 - 5 + 1)) + 5,
    avgSalesPerWeek: Math.floor(Math.random() * (50 - 1 + 1)) + 1,
    daysToReplenish: Math.floor(Math.random() * (14 - 1 + 1)) + 1,
  }));
}

// Normalize data for neural network
function normalizeData(data: ProductData[]) {
  const maxInventory = Math.max(...data.map(d => d.currentInventory));
  const maxSales = Math.max(...data.map(d => d.avgSalesPerWeek));
  const maxDays = Math.max(...data.map(d => d.daysToReplenish));

  return data.map(d => [
    d.currentInventory / maxInventory,
    d.avgSalesPerWeek / maxSales,
    d.daysToReplenish / maxDays,
  ]);
}

// Generate training labels based on simple logic
function generateLabels(data: ProductData[]): number[] {
  return data.map(d => {
    const weeksOfStock = d.currentInventory / d.avgSalesPerWeek;
    const weeksToReplenish = d.daysToReplenish / 7;
    return weeksOfStock <= weeksToReplenish * 1.5 ? 1 : 0;
  });
}

// Create and train the TensorFlow.js model
export async function trainModel(data: ProductData[]): Promise<tf.LayersModel> {
  const normalizedInputs = normalizeData(data);
  const labels = generateLabels(data);

  // Convert to tensors
  const xs = tf.tensor2d(normalizedInputs);
  const ys = tf.tensor2d(labels.map(l => [l]));

  // Create a simple sequential model
  const model = tf.sequential({
    layers: [
      tf.layers.dense({ inputShape: [3], units: 8, activation: 'relu' }),
      tf.layers.dense({ units: 4, activation: 'relu' }),
      tf.layers.dense({ units: 1, activation: 'sigmoid' }),
    ],
  });

  model.compile({
    optimizer: tf.train.adam(0.01),
    loss: 'binaryCrossentropy',
    metrics: ['accuracy'],
  });

  // Train the model
  await model.fit(xs, ys, {
    epochs: 50,
    batchSize: 32,
    shuffle: true,
    verbose: 0,
  });

  // Clean up tensors
  xs.dispose();
  ys.dispose();

  return model;
}

// Make predictions for all products
export async function makePredictions(
  model: tf.LayersModel,
  data: ProductData[]
): Promise<PredictionResult[]> {
  const normalizedInputs = normalizeData(data);
  const xs = tf.tensor2d(normalizedInputs);

  const predictions = model.predict(xs) as tf.Tensor;
  const predictionValues = await predictions.data();

  xs.dispose();
  predictions.dispose();

  return data.map((product, i) => ({
    ...product,
    confidence: predictionValues[i],
    shouldReorder: predictionValues[i] > 0.5,
  }));
}
