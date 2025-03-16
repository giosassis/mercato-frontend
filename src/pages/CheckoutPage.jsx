import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { Button, Table, Form, InputGroup, Container, Row, Col, Alert, Spinner } from "react-bootstrap";
import { FaPlus, FaMinus, FaTrash, FaCreditCard, FaReceipt, FaShoppingCart } from "react-icons/fa";
import { searchProducts } from "../services/api";
import "../style/Checkout.css";

const CheckoutPage = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [barcode, setBarcode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchProducts = async () => {
      if (searchQuery.length > 2 || barcode.length > 2) {
        setLoading(true);
        setError(null);

        try {
          const data = await searchProducts(searchQuery || barcode);
          setProducts(data);
        } catch (err) {
          console.error("Error searching for products:", err);
          setError("Error searching for products. Please, try again.");
          setProducts([]);
        } finally {
          setLoading(false);
        }
      } else {
        setProducts([]);
      }
    };

    const debounceTimeout = setTimeout(fetchProducts, 500);
    return () => clearTimeout(debounceTimeout);
  }, [searchQuery, barcode]);

  const addToCart = (product) => {
    if (!product) return;

    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * Number(item.price) }
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1, total: Number(product.price) }];
      }
    });
  };

  const updateQuantity = (id, action) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: action === "increase" ? item.quantity + 1 : Math.max(1, item.quantity - 1),
              total: (action === "increase" ? item.quantity + 1 : Math.max(1, item.quantity - 1)) * Number(item.price),
            }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const subtotal = cart.reduce((sum, item) => sum + Number(item.total || 0), 0);
  const tax = subtotal * 0.0825;
  const total = subtotal + tax;

  return (
    <div className="checkout-layout">
      <Sidebar />
      <div className="checkout-main">
        <Container fluid className="checkout-container">
          <Row>
            <Col md={6} className="checkout-products">
              <h2 className="mb-3">venda</h2>
              <InputGroup className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="procurar produtos"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Form.Control
                  type="text"
                  placeholder="scanear código de barras"
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                />
                <Button 
                  onClick={() => products.length > 0 && addToCart(products[0])} 
                  disabled={products.length === 0}
                >
                  adicionar
                </Button>
              </InputGroup>

              {error && <Alert variant="danger">{error}</Alert>}
              {loading && <Spinner animation="border" />}

              <div className="product-list">
                {Array.isArray(products) && products.length > 0 ? (
                  <ul className="list-group">
                    {products.map((product) => (
                      <li
                        key={product.id}
                        className="list-group-item d-flex justify-content-between align-items-center"
                        onClick={() => addToCart(product)}
                      >
                        {product.name} - R${Number(product.price).toFixed(2)}
                        <Button variant="success" size="sm">
                          <FaPlus />
                        </Button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p> nenhum produto encontrado. </p>
                )}
              </div>
            </Col>

            <Col md={6} className="checkout-cart">
              <h4 className="mb-3"> venda atual </h4>
              {cart.length === 0 ? (
                <div className="empty-cart">
                  <FaShoppingCart size={48} className="empty-cart-icon" />
                  <p className="empty-cart-text"> nenhum produto no carrinho</p>
                  <p className="empty-cart-subtext"> scaneie o código de barras ou adicione o produto manualmente </p>
                </div>
              ) : (
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>item</th>
                      <th>preço</th>
                      <th>quantidade</th>
                      <th>total</th>
                      <th>deletar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.map((item) => (
                      <tr key={item.id}>
                        <td>{item.name}</td>
                        <td>R${Number(item.price).toFixed(2)}</td>
                        <td>
                          <Button size="sm" variant="outline-secondary" onClick={() => updateQuantity(item.id, "decrease")}>
                            <FaMinus />
                          </Button>
                          <span className="mx-2">{item.quantity}</span>
                          <Button size="sm" variant="outline-primary" onClick={() => updateQuantity(item.id, "increase")}>
                            <FaPlus />
                          </Button>
                        </td>
                        <td>R${Number(item.total).toFixed(2)}</td>
                        <td>
                          <Button size="sm" variant="danger" onClick={() => removeItem(item.id)}>
                            <FaTrash />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}

              <div className="checkout-summary mt-4">
                <p>subtotal: R${subtotal.toFixed(2)}</p>
                <p>taxa de serviço (8.25%): R${tax.toFixed(2)}</p>
                <h4>total: R${total.toFixed(2)}</h4>
                <div className="checkout-buttons mt-3">
                  <Button variant="outline-secondary" className="me-2">
                    <FaReceipt /> imprimir nota fiscal
                  </Button>
                  <Button variant="primary">
                    <FaCreditCard /> pagamento
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default CheckoutPage;