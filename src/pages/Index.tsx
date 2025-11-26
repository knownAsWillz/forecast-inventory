import { useEffect, useState } from 'react';
import { Loader2, Brain } from 'lucide-react';
import ProductTable from '@/components/ProductTable';
import StatsCards from '@/components/StatsCards';
import {
  generateInventoryMetrics,
  trainModel,
  makePredictions,
  PredictionResult,
} from '@/lib/mlModel';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [products, setProducts] = useState<PredictionResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState('Fetching product data...');
  const { toast } = useToast();

  useEffect(() => {
    const fetchAndPredict = async () => {
      try {
        setLoadingMessage('Fetching product data...');
        
        // Fetch products from DummyJSON API
        const response = await fetch('https://dummyjson.com/products?limit=100');
        const data = await response.json();

        setLoadingMessage('Generating inventory metrics...');
        await new Promise(resolve => setTimeout(resolve, 500));

        // Generate random inventory metrics
        const productsWithMetrics = generateInventoryMetrics(data.products);

        setLoadingMessage('Training ML model...');
        await new Promise(resolve => setTimeout(resolve, 500));

        // Train the TensorFlow.js model
        const model = await trainModel(productsWithMetrics);

        setLoadingMessage('Making predictions...');
        await new Promise(resolve => setTimeout(resolve, 500));

        // Make predictions
        const predictions = await makePredictions(model, productsWithMetrics);

        setProducts(predictions);
        setIsLoading(false);

        toast({
          title: 'Analysis Complete',
          description: `Analyzed ${predictions.length} products. ${
            predictions.filter(p => p.shouldReorder).length
          } items need reordering.`,
        });
      } catch (error) {
        console.error('Error fetching or processing data:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch and analyze products. Please try again.',
          variant: 'destructive',
        });
        setIsLoading(false);
      }
    };

    fetchAndPredict();
  }, [toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <Brain className="h-16 w-16 text-primary animate-pulse" />
              <Loader2 className="h-16 w-16 text-accent animate-spin absolute top-0 left-0" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Inventory Reorder Predictor
          </h2>
          <p className="text-muted-foreground">{loadingMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card shadow-sm">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Brain className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Inventory Reorder Predictor
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                AI-powered inventory management and reorder recommendations
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <StatsCards products={products} />
        
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-foreground mb-2">Product Inventory</h2>
          <p className="text-sm text-muted-foreground">
            Click column headers to sort. Red-highlighted rows indicate products that need reordering.
          </p>
        </div>

        <ProductTable products={products} />
      </main>
    </div>
  );
};

export default Index;
