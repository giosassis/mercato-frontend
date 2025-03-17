import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Alert, Spinner } from "react-bootstrap";
import { FaCreditCard, FaMoneyBillWave, FaQrcode, FaCheckCircle, FaFileInvoice } from "react-icons/fa";
import axios from "axios";
import { QRCodeSVG } from "qrcode.react";

const PaymentModal = ({ show, handleClose, saleId, totalAmount, resetCheckout }) => {

  const [paymentMethod, setPaymentMethod] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [receivedAmount, setReceivedAmount] = useState("");
  const [change, setChange] = useState(0);
  const [connecting, setConnecting] = useState(false);
  const [qrCode, setQrCode] = useState(null);
  const [success, setSuccess] = useState(false);
  const [invoiceId, setInvoiceId] = useState(null);
  const [downloadingInvoice, setDownloadingInvoice] = useState(false);

  // ✅ Processar pagamento
  const processPayment = async () => {
    setLoading(true);
    setError(null);

    if (!saleId) {
      setError("Erro: ID da venda inválido. Tente novamente.");
      setLoading(false);
      return;
    }

    const payload = {
      sale: saleId,
      payment_method: paymentMethod,
      amount: parseFloat(totalAmount).toFixed(2),
    };

    console.log(`🛠 Enviando pagamento para: http://localhost:8000/sales/${saleId}/payments/`, payload);

    try {
      const response = await axios.post(`http://localhost:8000/sales/${saleId}/payments/`, payload, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      console.log("✅ Pagamento processado com sucesso!", response.data);
      setSuccess(true);
      await generateInvoice(); // 🔹 Chamar geração da nota fiscal automaticamente
    } catch (err) {
      console.error("❌ Erro ao processar pagamento:", err.response?.data || err.message);
      setError("Erro ao processar pagamento. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Gerar QR Code quando selecionar PIX
  useEffect(() => {
    if (paymentMethod === "pix") {
      setQrCode(`https://fake-pix.com/payment?saleId=${saleId}&amount=${totalAmount}`);
    } else {
      setQrCode(null);
    }
  }, [paymentMethod, saleId, totalAmount]);

  // ✅ Calcular troco para pagamento em dinheiro
  const calculateChange = () => {
    if (Number(receivedAmount) >= Number(totalAmount)) {
      setChange(Number(receivedAmount) - Number(totalAmount));
    }
  };

  // ✅ Gerar Nota Fiscal
  const generateInvoice = async () => {
    if (!saleId) return;

    try {
      console.log(`🛠 Gerando Nota Fiscal para a venda: ${saleId}`);
      const response = await axios.post("http://localhost:8000/invoices/", { sale_id: saleId });

      console.log("✅ Nota Fiscal gerada!", response.data);
      setInvoiceId(response.data.id); // 🔹 Salvar o ID para baixar depois
    } catch (error) {
      console.error("❌ Erro ao gerar Nota Fiscal:", error.response?.data || error.message);
      setError("Erro ao gerar Nota Fiscal. Tente novamente.");
    }
  };

  // ✅ Baixar Nota Fiscal
  const downloadInvoice = async () => {
    if (!invoiceId) return;

    setDownloadingInvoice(true);
    try {
      console.log(`📥 Baixando Nota Fiscal ID: ${invoiceId}`);
      const response = await axios.get(`http://localhost:8000/invoices/${invoiceId}/download/`, {
        responseType: "blob",
      });

      // Criar URL para download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `nota_fiscal_${invoiceId}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("❌ Erro ao baixar Nota Fiscal:", error.response?.data || error.message);
      setError("Erro ao baixar Nota Fiscal. Tente novamente.");
    } finally {
      setDownloadingInvoice(false);
    }
  };

  // ✅ Resetar checkout após venda concluída
  const handleFinish = () => {
    if (resetCheckout) {
      resetCheckout();
    }
    setSuccess(false);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{success ? "Venda Concluída" : "Finalizar Pagamento"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {success ? (
          // ✅ Tela de sucesso
          <div className="text-center">
            <FaCheckCircle size={60} className="text-success mb-3" />
            <h4>Pagamento realizado com sucesso!</h4>
            <p>O pagamento foi registrado e a venda está concluída.</p>
          </div>
        ) : (
          // ✅ Tela de pagamento normal
          <>
            <Form.Group>
              <Form.Label>Selecione a forma de pagamento:</Form.Label>
              <Form.Select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                <option value="">Escolha uma opção</option>
                <option value="credit_card">Cartão de Crédito</option>
                <option value="debit_card">Cartão de Débito</option>
                <option value="pix">PIX</option>
                <option value="cash">Dinheiro</option>
              </Form.Select>
            </Form.Group>

            {paymentMethod === "pix" && qrCode && (
              <div className="text-center mt-3">
                <p>Escaneie o QR Code para pagamento:</p>
                <QRCodeSVG value={qrCode} size={200} />
              </div>
            )}

            {paymentMethod === "cash" && (
              <Form.Group className="mt-3">
                <Form.Label>Valor recebido:</Form.Label>
                <Form.Control
                  type="number"
                  value={receivedAmount}
                  onChange={(e) => setReceivedAmount(e.target.value)}
                />
                <Button className="mt-2" variant="success" onClick={calculateChange} disabled={Number(receivedAmount) < Number(totalAmount)}>
                  Calcular Troco
                </Button>
                {change > 0 && <p className="mt-2">Troco: R$ {change.toFixed(2)}</p>}
              </Form.Group>
            )}

            {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        {success ? (
          <>
            <Button variant="secondary" onClick={downloadInvoice} disabled={!invoiceId || downloadingInvoice}>
              <FaFileInvoice /> {downloadingInvoice ? "Baixando..." : "Imprimir Nota Fiscal"}
            </Button>
            <Button variant="success" onClick={handleFinish}>
              Encerrar
            </Button>
          </>
        ) : (
          <>
            <Button variant="secondary" onClick={handleClose}>Cancelar</Button>
            <Button variant="primary" onClick={processPayment} disabled={!paymentMethod || loading}>
              {loading ? <Spinner animation="border" size="sm" /> : "Finalizar Pagamento"}
            </Button>
          </>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default PaymentModal;
