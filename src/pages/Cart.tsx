
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, Truck, Plus, Minus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useShoppingCart } from '../contexts/ShoppingCartContext';
import { toast } from "@/components/ui/use-toast";

const Cart: React.FC = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useShoppingCart();
  const navigate = useNavigate();
  const [deliveryOption, setDeliveryOption] = useState<'pickup' | 'delivery'>('pickup');
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    address: '',
    note: ''
  });

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckout = () => {
    if (!customerInfo.name || !customerInfo.phone) {
      toast({
        title: "Information requise",
        description: "Veuillez fournir votre nom et numéro de téléphone.",
        variant: "destructive"
      });
      return;
    }

    if (deliveryOption === 'delivery' && !customerInfo.address) {
      toast({
        title: "Adresse requise",
        description: "Veuillez fournir votre adresse de livraison.",
        variant: "destructive"
      });
      return;
    }

    // Préparer le message WhatsApp
    let message = `Nouvelle commande de: ${customerInfo.name}\n`;
    message += `Téléphone: ${customerInfo.phone}\n`;
    message += `Mode de récupération: ${deliveryOption === 'pickup' ? 'Retrait en magasin' : 'Livraison'}\n`;
    
    if (deliveryOption === 'delivery') {
      message += `Adresse: ${customerInfo.address}\n`;
    }
    
    message += `\n*Produits commandés:*\n`;
    cartItems.forEach(item => {
      message += `- ${item.name} x${item.quantity} (${item.price * item.quantity}€)\n`;
    });
    
    message += `\nTotal: ${totalPrice}€ pour ${totalItems} article(s)\n`;
    
    if (customerInfo.note) {
      message += `\nNote: ${customerInfo.note}`;
    }
    
    // Encoder le message pour URL WhatsApp
    const encodedMessage = encodeURIComponent(message);
    
    // Numéro WhatsApp du gérant (à remplacer par le vrai numéro)
    const phoneNumber = "22507070707"; // Format: code pays sans + et numéro
    
    // Créer le lien WhatsApp
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    // Rediriger vers WhatsApp
    window.open(whatsappUrl, '_blank');
    
    // Vider le panier après la commande
    clearCart();
    
    toast({
      title: "Commande envoyée",
      description: "Votre commande a été transmise via WhatsApp. Le gérant vous contactera prochainement."
    });
    
    // Rediriger vers l'accueil
    navigate('/');
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Votre panier est vide</h1>
          <p className="text-gray-600 mb-8">Vous n'avez pas encore ajouté de produits à votre panier.</p>
          <Button onClick={() => navigate('/catalog')} className="bg-orange-600 hover:bg-orange-700">
            Découvrir nos produits
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Votre panier</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Liste des produits */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Articles ({totalItems})</h2>
            
            <div className="divide-y divide-gray-200">
              {cartItems.map(item => (
                <div key={item.id} className="py-4 flex items-center">
                  <div className="w-24 h-24 rounded-md overflow-hidden flex-shrink-0">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="ml-4 flex-1">
                    <h3 className="font-medium text-gray-800">{item.name}</h3>
                    <p className="text-orange-600 font-bold mt-1">{item.price} €</p>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 border border-gray-300 rounded"
                      disabled={item.quantity <= 1}
                    >
                      <Minus size={14} />
                    </button>
                    
                    <span className="w-8 text-center">{item.quantity}</span>
                    
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 border border-gray-300 rounded"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  
                  <div className="ml-4 text-right">
                    <p className="font-bold text-gray-800">{item.price * item.quantity} €</p>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 mt-1 flex items-center text-sm"
                    >
                      <Trash2 size={14} className="mr-1" /> Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Informations client */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Vos informations</h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nom et prénom *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={customerInfo.name}
                    onChange={handleInputChange}
                    placeholder="Votre nom complet"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Téléphone *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={customerInfo.phone}
                    onChange={handleInputChange}
                    placeholder="Votre numéro de téléphone"
                    required
                  />
                </div>
              </div>
              
              {/* Options de livraison */}
              <div>
                <Label className="mb-2 block">Mode de récupération *</Label>
                <RadioGroup 
                  value={deliveryOption} 
                  onValueChange={(value) => setDeliveryOption(value as 'pickup' | 'delivery')}
                  className="flex flex-col space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="pickup" id="pickup" />
                    <Label htmlFor="pickup" className="flex items-center cursor-pointer">
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      Retrait en magasin
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="delivery" id="delivery" />
                    <Label htmlFor="delivery" className="flex items-center cursor-pointer">
                      <Truck className="mr-2 h-4 w-4" />
                      Livraison à domicile
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              
              {/* Adresse si livraison */}
              {deliveryOption === 'delivery' && (
                <div>
                  <Label htmlFor="address">Adresse de livraison *</Label>
                  <Input
                    id="address"
                    name="address"
                    value={customerInfo.address}
                    onChange={handleInputChange}
                    placeholder="Votre adresse complète"
                    required
                  />
                </div>
              )}
              
              <div>
                <Label htmlFor="note">Note (facultatif)</Label>
                <Input
                  id="note"
                  name="note"
                  value={customerInfo.note}
                  onChange={handleInputChange}
                  placeholder="Instructions spéciales pour votre commande"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Résumé */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm p-6 sticky top-28">
            <h2 className="text-xl font-semibold mb-4">Résumé de la commande</h2>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Sous-total ({totalItems} articles)</span>
                <span className="font-medium">{totalPrice} €</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Frais de livraison</span>
                <span className="font-medium">
                  {deliveryOption === 'delivery' ? 'À déterminer' : 'Gratuit'}
                </span>
              </div>
              <div className="border-t border-gray-200 pt-2 mt-2">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-orange-600">{totalPrice} €</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {deliveryOption === 'delivery' 
                    ? 'Hors frais de livraison. Le gérant vous contactera pour confirmer le montant final.' 
                    : 'À régler lors du retrait en magasin.'}
                </p>
              </div>
            </div>
            
            <Button 
              onClick={handleCheckout}
              className="w-full py-6 bg-orange-600 hover:bg-orange-700 text-lg font-medium"
            >
              Valider ma commande
            </Button>
            
            <p className="text-xs text-gray-500 mt-4 text-center">
              En cliquant sur "Valider ma commande", vous serez redirigé vers WhatsApp pour finaliser votre commande directement avec le gérant.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
