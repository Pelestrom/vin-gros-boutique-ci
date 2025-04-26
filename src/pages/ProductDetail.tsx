
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, Minus, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useShoppingCart } from '../contexts/ShoppingCartContext';
import { toast } from "@/components/ui/use-toast";

// Types pour les produits
type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  description?: string;
  image: string;
  stock: number;
  isLimited?: boolean;
  isNew?: boolean;
  isPromo?: boolean;
};

// Données de produit temporaires (à remplacer par des données dynamiques)
const products: Product[] = [
  {
    id: 1,
    name: 'Château Margaux 2018',
    category: 'Vins',
    price: 95,
    description: 'Un vin rouge d\'exception de la région de Bordeaux. Le Château Margaux 2018 offre un bouquet complexe de fruits noirs, d\'épices et de notes boisées. En bouche, il révèle une structure tannique élégante et une longueur remarquable.',
    image: "/lovable-uploads/3112be4c-c1f6-41f4-8eea-ea9ebc741373.png",
    stock: 15,
    isLimited: true,
    isNew: true,
  },
  {
    id: 2,
    name: 'Hennessy XO',
    category: 'Liqueurs',
    price: 150,
    description: 'Un cognac d\'exception vieilli pendant plus de dix ans. Le Hennessy XO séduit par ses arômes riches de fruits confits, d\'épices et de chocolat. Sa texture onctueuse et sa finale persistante en font un spiritueux de référence.',
    image: "/lovable-uploads/3112be4c-c1f6-41f4-8eea-ea9ebc741373.png",
    stock: 8,
    isLimited: true,
    isPromo: true,
  },
];

const ProductDetail: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useShoppingCart();

  // Trouver le produit correspondant à l'ID
  const product = products.find(p => p.id === Number(productId));

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Produit non trouvé</h2>
          <p className="mb-6">Le produit que vous recherchez n'existe pas.</p>
          <Button onClick={() => navigate('/catalog')}>
            Retour au catalogue
          </Button>
        </div>
      </div>
    );
  }

  const handleQuantityChange = (amount: number) => {
    setQuantity(prev => {
      const newQuantity = prev + amount;
      return newQuantity > 0 && newQuantity <= product.stock ? newQuantity : prev;
    });
  };

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      image: product.image
    });
    
    toast({
      title: "Produit ajouté",
      description: `${product.name} a été ajouté au panier`,
    });
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Image du produit */}
        <div className="rounded-xl overflow-hidden shadow-md">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Informations du produit */}
        <div>
          <div className="mb-2 text-sm text-orange-600 font-medium">{product.category}</div>
          <h1 className="text-3xl font-bold mb-4 text-gray-800">{product.name}</h1>
          
          {/* Badges */}
          <div className="flex space-x-2 mb-6">
            {product.isNew && (
              <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded">
                NOUVEAU
              </span>
            )}
            {product.isPromo && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                PROMO
              </span>
            )}
            {product.isLimited && (
              <span className="bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded flex items-center">
                Stock limité: {product.stock}
              </span>
            )}
          </div>

          {/* Prix */}
          <div className="text-2xl font-bold text-orange-600 mb-4">
            {product.price * quantity} €
          </div>

          {/* Description */}
          <p className="text-gray-600 mb-8">
            {product.description || "Aucune description disponible pour ce produit."}
          </p>

          {/* Quantité et ajout au panier */}
          <div className="mb-8">
            <label className="block text-gray-700 font-medium mb-2">Quantité</label>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => handleQuantityChange(-1)}
                className="p-2 border border-gray-300 rounded"
                disabled={quantity <= 1}
              >
                <Minus size={16} />
              </button>
              
              <span className="text-lg font-medium w-8 text-center">{quantity}</span>
              
              <button 
                onClick={() => handleQuantityChange(1)}
                className="p-2 border border-gray-300 rounded"
                disabled={quantity >= product.stock}
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Bouton d'ajout au panier */}
          <Button 
            onClick={handleAddToCart}
            className="w-full py-3 bg-orange-600 hover:bg-orange-700"
          >
            <ShoppingCart className="mr-2 h-5 w-5" /> Ajouter au panier
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
