# API Integration Guide

Dokumentasi lengkap untuk integrasi frontend dengan backend API.

## 🔌 API Client

API client tersedia di `lib/api.ts` yang menyediakan centralized API calls.

```typescript
import { api } from '@/lib/api';
```

---

## 📡 Base Configuration

```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
```

**Environment Variables:**
- Development: `http://localhost:5000/api`
- Production: `https://api.bagiberkah.com/api`

---

## 🎯 API Endpoints

### 1. Envelope APIs

#### Create Envelope

```typescript
const envelope = await api.createEnvelope({
  totalBudget: 1000000,
  distributionMode: 'digital', // or 'cash'
  recipients: [
    {
      name: 'Adik Kecil',
      ageLevel: 'child',
      status: 'school',
      closeness: 'very_close',
      greetingContext: 'Adik yang rajin puasa'
    }
  ]
});

// Response
{
  id: 'env_123',
  totalBudget: 1000000,
  distributionMode: 'digital',
  recipients: [...],
  status: 'draft',
  createdAt: '2026-03-01T00:00:00Z'
}
```

#### Get Envelope

```typescript
const envelope = await api.getEnvelope('env_123');

// Response
{
  id: 'env_123',
  totalBudget: 1000000,
  recipients: [...],
  status: 'active',
  paymentUrl: 'https://payment.mayar.id/...'
}
```

#### Get Envelope Status

```typescript
const status = await api.getEnvelopeStatus('env_123');

// Response
{
  envelopeId: 'env_123',
  status: 'active',
  totalClaimed: 3,
  totalRecipients: 5,
  claims: [...]
}
```

---

### 2. AI APIs

#### Get AI Allocation

```typescript
const allocation = await api.getAIAllocation({
  totalBudget: 1000000,
  recipients: [
    {
      name: 'Adik A',
      ageLevel: 'child',
      status: 'school',
      closeness: 'very_close'
    },
    {
      name: 'Sepupu B',
      ageLevel: 'teen',
      status: 'college',
      closeness: 'close'
    }
  ]
});

// Response
{
  allocations: [
    {
      recipientIndex: 0,
      amount: 600000,
      reasoning: 'Anak-anak dengan kedekatan sangat dekat mendapat porsi lebih besar...'
    },
    {
      recipientIndex: 1,
      amount: 400000,
      reasoning: 'Remaja kuliah dengan kedekatan cukup dekat...'
    }
  ],
  totalAllocated: 1000000
}
```

#### Generate Greeting

```typescript
const greeting = await api.generateGreeting({
  recipientName: 'Adik Kecil',
  ageLevel: 'child',
  context: 'Adik yang rajin puasa',
  amount: 150000
});

// Response
{
  greeting: 'Selamat Idul Fitri adik kecil yang rajin! Kakak bangga kamu rajin puasa...',
  tone: 'warm',
  language: 'id'
}
```

---

### 3. Claim APIs

#### Get Claim

```typescript
const claim = await api.getClaim('claim_token_abc123');

// Response
{
  token: 'claim_token_abc123',
  recipientName: 'Adik Kecil',
  amount: 150000,
  greeting: 'Selamat Idul Fitri...',
  status: 'pending',
  expiresAt: '2026-03-15T23:59:59Z'
}
```

#### Submit Claim

```typescript
const result = await api.submitClaim('claim_token_abc123', {
  method: 'digital', // or 'cash'
  bankAccount: '1234567890', // for digital
  bankName: 'BCA' // for digital
});

// Response
{
  claimId: 'claim_123',
  status: 'claimed',
  qrToken: 'qr_xyz789', // for cash mode
  transferStatus: 'processing' // for digital mode
}
```

#### Validate QR

```typescript
const validation = await api.validateQR('qr_xyz789');

// Response
{
  valid: true,
  recipientName: 'Adik Kecil',
  amount: 150000,
  claimId: 'claim_123'
}
```

---

### 4. Payment APIs

#### Create Payment

```typescript
const payment = await api.createPayment('env_123');

// Response
{
  paymentId: 'pay_456',
  paymentUrl: 'https://payment.mayar.id/...',
  amount: 1000000,
  status: 'pending',
  expiresAt: '2026-03-01T01:00:00Z'
}
```

#### Get Payment Status

```typescript
const status = await api.getPaymentStatus('pay_456');

// Response
{
  paymentId: 'pay_456',
  status: 'success', // or 'pending', 'failed'
  paidAt: '2026-03-01T00:30:00Z',
  amount: 1000000
}
```

---

## 🔐 Error Handling

### API Client Error Handling

```typescript
try {
  const envelope = await api.createEnvelope(data);
  // Success
} catch (error) {
  // Error handling
  console.error('API Error:', error.message);
  
  // Show error to user
  alert(error.message);
}
```

### Error Response Format

```typescript
{
  error: true,
  message: 'Error message here',
  code: 'ERROR_CODE',
  details: { ... } // optional
}
```

### Common Error Codes

- `VALIDATION_ERROR`: Input validation failed
- `NOT_FOUND`: Resource not found
- `UNAUTHORIZED`: Authentication required
- `PAYMENT_FAILED`: Payment processing failed
- `EXPIRED`: Token or claim expired
- `ALREADY_CLAIMED`: Claim already processed

---

## 🎣 Using Custom Hooks

### useEnvelope Hook

```typescript
import { useEnvelope } from '@/hooks/useEnvelope';

function EnvelopeDetail({ id }: { id: string }) {
  const { envelope, loading, error, refetch } = useEnvelope(id);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!envelope) return <div>Not found</div>;

  return (
    <div>
      <h1>{envelope.id}</h1>
      <p>Budget: {envelope.totalBudget}</p>
      <button onClick={refetch}>Refresh</button>
    </div>
  );
}
```

### useCreateEnvelope Hook

```typescript
import { useCreateEnvelope } from '@/hooks/useEnvelope';

function CreateForm() {
  const { createEnvelope, loading, error } = useCreateEnvelope();

  const handleSubmit = async (data: any) => {
    try {
      const envelope = await createEnvelope(data);
      console.log('Created:', envelope);
      // Redirect or show success
    } catch (err) {
      console.error('Failed:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button disabled={loading}>
        {loading ? 'Creating...' : 'Create'}
      </button>
      {error && <p className="error">{error}</p>}
    </form>
  );
}
```

### useClaim Hook

```typescript
import { useClaim } from '@/hooks/useClaim';

function ClaimPage({ token }: { token: string }) {
  const { claim, loading, error, submitClaim } = useClaim(token);

  const handleClaim = async () => {
    try {
      await submitClaim({ method: 'digital' });
      // Show success
    } catch (err) {
      console.error('Claim failed:', err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>{claim?.recipientName}</h1>
      <p>Amount: {claim?.amount}</p>
      <button onClick={handleClaim}>Claim Now</button>
    </div>
  );
}
```

---

## 🔄 Request/Response Flow

### Create Envelope Flow

```
Frontend                Backend                 AI Service
   |                       |                        |
   |-- POST /envelopes --->|                        |
   |                       |--- AI Allocation ----->|
   |                       |<-- Recommendations ----|
   |<-- Envelope Data -----|                        |
   |                       |                        |
```

### Claim Flow

```
Frontend                Backend                 Database
   |                       |                        |
   |-- GET /claims/:token->|                        |
   |                       |--- Query Claim ------->|
   |                       |<-- Claim Data ---------|
   |<-- Claim Info --------|                        |
   |                       |                        |
   |-- POST /claims/:token>|                        |
   |                       |--- Update Status ----->|
   |                       |<-- Success ------------|
   |<-- QR Token/Status ---|                        |
```

---

## 🧪 Testing API Calls

### Using Browser Console

```javascript
// Test create envelope
fetch('http://localhost:5000/api/envelopes', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    totalBudget: 1000000,
    recipients: [...]
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

### Using Postman/Thunder Client

1. Create new request
2. Set method (GET/POST)
3. Set URL: `http://localhost:5000/api/...`
4. Add headers: `Content-Type: application/json`
5. Add body (for POST)
6. Send request

---

## 📝 Type Definitions

Semua types ada di `lib/types.ts`:

```typescript
// Import types
import type { 
  Envelope, 
  Recipient, 
  ClaimData,
  AIAllocationRequest,
  AIAllocationResponse 
} from '@/lib/types';

// Use in components
const envelope: Envelope = { ... };
const recipient: Recipient = { ... };
```

---

## 🚀 Best Practices

### 1. Always Use API Client

```typescript
// ✅ Good
import { api } from '@/lib/api';
const data = await api.getEnvelope(id);

// ❌ Bad
const data = await fetch('/api/envelopes/' + id);
```

### 2. Handle Errors Properly

```typescript
// ✅ Good
try {
  const data = await api.createEnvelope(envelope);
  showSuccess('Envelope created!');
} catch (error) {
  showError(error.message);
}

// ❌ Bad
const data = await api.createEnvelope(envelope);
// No error handling
```

### 3. Use TypeScript Types

```typescript
// ✅ Good
import type { Envelope } from '@/lib/types';
const envelope: Envelope = await api.getEnvelope(id);

// ❌ Bad
const envelope: any = await api.getEnvelope(id);
```

### 4. Use Custom Hooks

```typescript
// ✅ Good
const { envelope, loading, error } = useEnvelope(id);

// ❌ Bad
const [envelope, setEnvelope] = useState(null);
useEffect(() => {
  api.getEnvelope(id).then(setEnvelope);
}, [id]);
```

---

## 🔧 Debugging Tips

### 1. Check Network Tab

- Open DevTools (F12)
- Go to Network tab
- Filter by XHR/Fetch
- Check request/response

### 2. Log API Calls

```typescript
// Add logging in api.ts
console.log('API Call:', endpoint, options);
console.log('API Response:', response);
```

### 3. Check Backend Logs

```bash
# Backend terminal
# Check for incoming requests and errors
```

### 4. Verify Environment Variables

```typescript
console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);
```

---

## 📚 Additional Resources

- Backend API Documentation (check backend/README.md)
- [Fetch API MDN](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [React Query](https://tanstack.com/query) (alternative for data fetching)
