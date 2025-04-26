
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

const Catalog = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [filters, setFilters] = useState({
    vins: true,
    liqueurs: true,
    boissons: true,
    sucreries: true,
    bieres: true,
    nouveautes: false,
    promotions: false,
    stockLimite: false
  });

  // Parse query parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get('search');
    const categoryParam = params.get('category');
    
    if (searchParam) {
      setSearchQuery(searchParam);
    }
    
    if (categoryParam) {
      // Reset all category filters
      const newFilters = {
        vins: false,
        liqueurs: false,
        boissons: false,
        sucreries: false,
        bieres: false,
        nouveautes: filters.nouveautes,
        promotions: filters.promotions,
        stockLimite: filters.stockLimite
      };
      
      // Set the selected category
      switch (categoryParam.toLowerCase()) {
        case 'vins':
          newFilters.vins = true;
          break;
        case 'liqueurs':
          newFilters.liqueurs = true;
          break;
        case 'boissons':
          newFilters.boissons = true;
          break;
        case 'sucreries':
          newFilters.sucreries = true;
          break;
        case 'bières':
          newFilters.bieres = true;
          break;
        case 'eaux minérales':
          newFilters.boissons = true;
          break;
        default:
          break;
      }
      
      setFilters(newFilters);
    }
  }, [location.search]);

  const products = [
    {
      id: 1,
      name: "Château Margaux 2018",
      category: "Vins",
      price: 95,
      image: "/lovable-uploads/3112be4c-c1f6-41f4-8eea-ea9ebc741373.png",
      stock: 15,
      isLimited: true,
      isNew: true
    },
    {
      id: 2,
      name: "Hennessy XO",
      category: "Liqueurs",
      price: 150,
      image: "/lovable-uploads/3112be4c-c1f6-41f4-8eea-ea9ebc741373.png",
      stock: 8,
      isLimited: true,
      isPromo: true
    },
    {
      id: 3,
      name: "Heineken Pack 24",
      category: "Bières",
      price: 35,
      image: "/lovable-uploads/3112be4c-c1f6-41f4-8eea-ea9ebc741373.png",
      stock: 50,
      isNew: false,
      isPromo: false
    },
    {
      id: 4,
      name: "Assortiment Chocolats Fins",
      category: "Sucreries",
      price: 30,
      image: "/lovable-uploads/3112be4c-c1f6-41f4-8eea-ea9ebc741373.png",
      stock: 20,
      isNew: false,
      isPromo: true
    }
  ];

  const handleFilterChange = (key: string) => {
    setFilters(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
  };

  const handleProductClick = (productId: number) => {
    navigate(`/product/${productId}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Update URL with search parameter
    navigate(`/catalog?search=${searchQuery}`);
  };

  // Filter products based on search query and filters
  const filteredProducts = products.filter(product => {
    // Check search query
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Check category filters
    if (
      !(filters.vins && product.category === "Vins") &&
      !(filters.liqueurs && product.category === "Liqueurs") &&
      !(filters.boissons && product.category === "Boissons") &&
      !(filters.sucreries && product.category === "Sucreries") &&
      !(filters.bieres && product.category === "Bières")
    ) {
      return false;
    }
    
    // Check other filters
    if (filters.nouveautes && !product.isNew) return false;
    if (filters.promotions && !product.isPromo) return false;
    if (filters.stockLimite && !product.isLimited) return false;
    
    // Check price range
    if (product.price < priceRange[0] || product.price > priceRange[1]) return false;
    
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Catalogue Complet</h1>
        
        {/* Search Bar */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <Input
              type="text"
              placeholder="Rechercher un produit..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" className="bg-orange-600 hover:bg-orange-700">
              <Search className="mr-2 h-4 w-4" />
              Rechercher
            </Button>
          </form>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Filtres</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Catégories</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Checkbox 
                        checked={filters.vins} 
                        onCheckedChange={() => handleFilterChange('vins')}
                        id="vins"
                      />
                      <label htmlFor="vins" className="ml-2">Vins</label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox 
                        checked={filters.liqueurs} 
                        onCheckedChange={() => handleFilterChange('liqueurs')}
                        id="liqueurs"
                      />
                      <label htmlFor="liqueurs" className="ml-2">Liqueurs</label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox 
                        checked={filters.boissons} 
                        onCheckedChange={() => handleFilterChange('boissons')}
                        id="boissons"
                      />
                      <label htmlFor="boissons" className="ml-2">Boissons</label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox 
                        checked={filters.sucreries} 
                        onCheckedChange={() => handleFilterChange('sucreries')}
                        id="sucreries"
                      />
                      <label htmlFor="sucreries" className="ml-2">Sucreries</label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox 
                        checked={filters.bieres} 
                        onCheckedChange={() => handleFilterChange('bieres')}
                        id="bieres"
                      />
                      <label htmlFor="bieres" className="ml-2">Bières</label>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Prix (€)</h3>
                  <Slider
                    value={priceRange}
                    max={500}
                    step={10}
                    onValueChange={setPriceRange}
                    className="my-4"
                  />
                  <div className="flex gap-4 items-center">
                    <Input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                      className="w-20"
                    />
                    <span>-</span>
                    <Input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-20"
                    />
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Autres Filtres</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Checkbox 
                        checked={filters.nouveautes} 
                        onCheckedChange={() => handleFilterChange('nouveautes')}
                        id="nouveautes"
                      />
                      <label htmlFor="nouveautes" className="ml-2">Nouveautés</label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox 
                        checked={filters.promotions} 
                        onCheckedChange={() => handleFilterChange('promotions')}
                        id="promotions"
                      />
                      <label htmlFor="promotions" className="ml-2">Promotions</label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox 
                        checked={filters.stockLimite} 
                        onCheckedChange={() => handleFilterChange('stockLimite')}
                        id="stockLimite"
                      />
                      <label htmlFor="stockLimite" className="ml-2">Stock limité</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="lg:w-3/4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div 
                  key={product.id} 
                  className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition cursor-pointer"
                  onClick={() => handleProductClick(product.id)}
                >
                  <div className="relative h-48">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    {product.isNew && (
                      <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded">
                        NOUVEAU
                      </div>
                    )}
                    {product.isPromo && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                        PROMO
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="text-sm text-gray-500 mb-1">{product.category}</div>
                    <h3 className="font-semibold text-gray-800 mb-2">{product.name}</h3>
                    <div className="flex justify-between items-end">
                      <div>
                        <div className="text-orange-600 font-bold">{product.price} €</div>
                      </div>
                      <Button 
                        variant="default"
                        size="icon"
                        className="bg-orange-600 hover:bg-orange-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleProductClick(product.id);
                        }}
                      >
                        <ShoppingCart className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredProducts.length === 0 && (
                <div className="col-span-full py-10 text-center">
                  <p className="text-gray-600">Aucun produit ne correspond à vos critères de recherche.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Catalog;
