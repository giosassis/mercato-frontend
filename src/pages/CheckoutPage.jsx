import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import {
  Button,
  Table,
  Form,
  InputGroup,
  Container,
  Row,
  Col,
  Alert,
  Spinner,
} from "react-bootstrap";
import {
  FaPlus,
  FaMinus,
  FaTrash,
  FaCreditCard,
  FaReceipt,
  FaShoppingCart,
} from "react-icons/fa";
import { searchProducts, createSale } from "../services/api";
import "../style/Checkout.css";
import PaymentModal from "../components/PaymentModal";

const CheckoutPage = () => {
  const cashierId = "de4d0835-fa03-413f-b539-2c18fca15421";
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [barcode, setBarcode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [saleId, setSaleId] = useState(null);
  const [processingSale, setProcessingSale] = useState(false);

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
          setError("Erro ao buscar produtos. Tente novamente.");
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
            ? {
                ...item,
                quantity: item.quantity + 1,
                total: (item.quantity + 1) * Number(item.price),
              }
            : item
        );
      } else {
        return [
          ...prevCart,
          { ...product, quantity: 1, total: Number(product.price) },
        ];
      }
    });
  };

  const updateQuantity = (id, action) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity:
                action === "increase"
                  ? item.quantity + 1
                  : Math.max(1, item.quantity - 1),
              total:
                (action === "increase"
                  ? item.quantity + 1
                  : Math.max(1, item.quantity - 1)) * Number(item.price),
            }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const subtotal = cart.reduce((sum, item) => sum + Number(item.total || 0), 0);
  const total = subtotal;

  // Criar venda antes do pagamento e abrir modal automaticamente
  const handleCreateSale = async () => {
    if (cart.length === 0) {
      alert("Adicione produtos ao carrinho antes de prosseguir.");
      return;
    }

    setProcessingSale(true);

    try {
      const saleData = {
        cashier: cashierId, // ✅ ID do operador de caixa
        items: cart.map((item) => ({
          product: item.id, // ✅ Apenas o ID do produto
          quantity: item.quantity,
          subtotal: item.total,
        })),
      };

      console.log("Enviando para o backend:", saleData);

      const response = await createSale(saleData);
      setSaleId(response.id); // ✅ Armazena o ID da venda criada
      setShowPaymentModal(true); // ✅ Abre o modal automaticamente após criar a venda
    } catch (error) {
      console.error(
        "Erro ao criar venda:",
        error.response?.data || error.message
      );
      setError("Erro ao criar venda. Tente novamente.");
    } finally {
      setProcessingSale(false);
    }
  };

  return (
    <div className="checkout-layout">
      <Sidebar />
      <div className="checkout-main">
        <Container fluid className="checkout-container">
          <Row>
            <Col md={6} className="checkout-products">
              <h2 className="mb-3">Venda</h2>
              <InputGroup className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Procurar produtos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Form.Control
                  type="text"
                  placeholder="Scanear código de barras..."
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                />
                <Button
                  onClick={() => products.length > 0 && addToCart(products[0])}
                  disabled={products.length === 0}
                >
                  Adicionar
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
                  <p>Nenhum produto encontrado.</p>
                )}
              </div>
            </Col>

            <Col md={6} className="checkout-cart">
              <h4 className="mb-3">Venda Atual</h4>
              {cart.length === 0 ? (
                <div className="empty-cart">
                  <FaShoppingCart size={48} className="empty-cart-icon" />
                  <p className="empty-cart-text">Nenhum produto no carrinho</p>
                  <p className="empty-cart-subtext">
                    Escaneie o código de barras ou adicione o produto
                    manualmente.
                  </p>
                </div>
              ) : (
                <>
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th>Preço</th>
                        <th>Quantidade</th>
                        <th>Total</th>
                        <th>Deletar</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cart.map((item) => (
                        <tr key={item.id}>
                          <td>{item.name}</td>
                          <td>R${Number(item.price).toFixed(2)}</td>
                          <td>
                            <Button
                              size="sm"
                              variant="outline-secondary"
                              onClick={() =>
                                updateQuantity(item.id, "decrease")
                              }
                            >
                              <FaMinus />
                            </Button>
                            <span className="mx-2">{item.quantity}</span>
                            <Button
                              size="sm"
                              variant="outline-primary"
                              onClick={() =>
                                updateQuantity(item.id, "increase")
                              }
                            >
                              <FaPlus />
                            </Button>
                          </td>
                          <td>R${Number(item.total).toFixed(2)}</td>
                          <td>
                            <Button
                              size="sm"
                              variant="danger"
                              onClick={() => removeItem(item.id)}
                            >
                              <FaTrash />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>

                  <h5>Subtotal: R${subtotal.toFixed(2)}</h5>
                  <h5>Total: R${total.toFixed(2)}</h5>
                </>
              )}
              <Button variant="outline-secondary" className="me-2">
                <FaReceipt /> imprimir nota fiscal
              </Button>
              <Button
                variant="primary"
                onClick={handleCreateSale}
                disabled={processingSale}
              >
                {processingSale ? "Processando..." : "Pagamento"}
              </Button>
            </Col>
          </Row>
        </Container>
      </div>
      <PaymentModal
        show={showPaymentModal}
        handleClose={() => setShowPaymentModal(false)}
        saleId={saleId}
        totalAmount={total.toFixed(2)}
        resetCheckout={() => {
          setCart([]); // Limpa o carrinho
          setSaleId(null); // Reseta o ID da venda
          setShowPaymentModal(false); // Fecha o modal
        }}
      />
    </div>
  );
};

export default CheckoutPage;
