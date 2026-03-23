'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { COLORS, fmt } from '@/lib/constants';
import { Btn, Input } from '@/components/ui';
import { useAppSelector, useAppDispatch } from '@/hooks/redux';
import { selectCart, selectUser } from '@/store/selectors';
import { clearCart } from '@/store/cartSlice';
import { api } from '@/lib/api';

declare global { interface Window { Razorpay: any; } }

export default function CheckoutPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const cart = useAppSelector(selectCart);
  const user = useAppSelector(selectUser);
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState({ name: user?.name || '', phone: '', street: '', city: '', state: '', pincode: '' });
  const [payMethod, setPayMethod] = useState('razorpay');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const set = (k: string) => (v: string) => setAddress(a => ({ ...a, [k]: v }));

  const handlePay = async () => {
    setProcessing(true);
    try {
      const { orderId: rzpOrderId, amount } = await api.payments.createOrder(total);

      const rzp = new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RZP_KEY,
        amount,
        order_id: rzpOrderId,
        currency: 'INR',
        name: 'Bazaar',
        handler: async (response: any) => {
          await api.payments.verify({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });
          const order = await api.orders.create({
            items: cart.map(i => ({ productId: i.id, qty: i.qty, price: i.price })),
            ...address.name && {
              addressName: address.name, addressPhone: address.phone,
              addressStreet: address.street, addressCity: address.city,
              addressState: address.state, addressPincode: address.pincode,
            },
            paymentOrderId: rzpOrderId,
          });
          setOrderId(order.id);
          dispatch(clearCart());
          setSuccess(true);
        },
        prefill: { name: user?.name, email: user?.email },
        theme: { color: '#F97316' },
      });
      rzp.open();
    } catch (e) {
      alert('Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (success) return (
    <div style={{ textAlign: 'center', padding: 80 }}>
      <div style={{ fontSize: 72, marginBottom: 16 }}>✅</div>
      <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Order Placed Successfully!</h2>
      <p style={{ color: COLORS.textMuted, fontSize: 16, marginBottom: 32 }}>Order <strong>#{orderId.slice(-8).toUpperCase()}</strong> confirmed. You'll receive updates via email.</p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
        <Btn onClick={() => router.push('/orders')}>Track Order</Btn>
        <Btn variant="ghost" onClick={() => router.push('/')}>Continue Shopping</Btn>
      </div>
    </div>
  );

  const steps = ['Address', 'Payment', 'Confirm'];
  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: 32 }}>
      {/* Razorpay script */}
      <script src="https://checkout.razorpay.com/v1/checkout.js" async />

      {/* Step indicator */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 40 }}>
        {steps.map((s, i) => (
          <div key={s} style={{ display: 'flex', alignItems: 'center', flex: i < steps.length - 1 ? 1 : 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: step > i + 1 ? COLORS.success : step === i + 1 ? COLORS.brandAccent : COLORS.border, color: step >= i + 1 ? '#fff' : COLORS.textMuted, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700 }}>
                {step > i + 1 ? '✓' : i + 1}
              </div>
              <span style={{ fontSize: 14, fontWeight: step === i + 1 ? 600 : 400, color: step === i + 1 ? COLORS.text : COLORS.textMuted }}>{s}</span>
            </div>
            {i < steps.length - 1 && <div style={{ flex: 1, height: 1, background: step > i + 1 ? COLORS.success : COLORS.border, margin: '0 12px' }} />}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: 28 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Delivery Address</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Input placeholder="Full Name" value={address.name} onChange={set('name')} />
            <Input placeholder="Phone Number" value={address.phone} onChange={set('phone')} />
            <Input placeholder="Street Address" value={address.street} onChange={set('street')} style={{ gridColumn: '1/-1' }} />
            <Input placeholder="City" value={address.city} onChange={set('city')} />
            <Input placeholder="Pincode" value={address.pincode} onChange={set('pincode')} />
            <Input placeholder="State" value={address.state} onChange={set('state')} style={{ gridColumn: '1/-1' }} />
          </div>
          <Btn onClick={() => setStep(2)} style={{ marginTop: 20, width: '100%', justifyContent: 'center' }} disabled={!address.name || !address.phone}>
            Continue to Payment
          </Btn>
        </div>
      )}

      {step === 2 && (
        <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: 28 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Payment Method</h3>
          {[
            { id: 'razorpay', label: 'Pay Online (Razorpay)', icon: '💳' },
            { id: 'cod', label: 'Cash on Delivery', icon: '💵' },
          ].map(m => (
            <div key={m.id} onClick={() => setPayMethod(m.id)}
              style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 16, border: `2px solid ${payMethod === m.id ? COLORS.brandAccent : COLORS.border}`, borderRadius: 10, marginBottom: 10, cursor: 'pointer', background: payMethod === m.id ? COLORS.brandLight : COLORS.surface }}>
              <span style={{ fontSize: 24 }}>{m.icon}</span>
              <span style={{ fontWeight: 600, fontSize: 14 }}>{m.label}</span>
              <div style={{ marginLeft: 'auto', width: 18, height: 18, borderRadius: '50%', border: `2px solid ${payMethod === m.id ? COLORS.brandAccent : COLORS.border}`, background: payMethod === m.id ? COLORS.brandAccent : 'transparent' }} />
            </div>
          ))}
          <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
            <Btn variant="ghost" onClick={() => setStep(1)}>← Back</Btn>
            <Btn onClick={() => setStep(3)} style={{ flex: 1, justifyContent: 'center' }}>Review Order</Btn>
          </div>
        </div>
      )}

      {step === 3 && (
        <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: 28 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Order Confirmation</h3>
          <div style={{ background: COLORS.surfaceAlt, borderRadius: 8, padding: 16, marginBottom: 16 }}>
            {cart.map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px solid ${COLORS.border}`, fontSize: 14 }}>
                <span>{item.image} {item.name} × {item.qty}</span>
                <span style={{ fontWeight: 600 }}>{fmt(item.price * item.qty)}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 12, fontWeight: 700, fontSize: 16 }}>
              <span>Total</span><span>{fmt(total)}</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <Btn variant="ghost" onClick={() => setStep(2)}>← Back</Btn>
            <Btn onClick={handlePay} style={{ flex: 1, justifyContent: 'center' }} disabled={processing}>
              {processing ? 'Processing...' : `Pay ${fmt(total)}`}
            </Btn>
          </div>
        </div>
      )}
    </div>
  );
}
