# Getting Started with KODEON Web3/Blockchain Framework

This guide will help you get started with the KODEON Web3/Blockchain Framework, a comprehensive library for blockchain development in the KODEON programming language.

## Installation

To use the KODEON Web3/Blockchain Framework in your project, simply import it:

```kodeon
impor "web3" sebagai web3
```

## Creating Your First Blockchain

Here's a simple example that demonstrates creating a blockchain and adding transactions:

```kodeon
// Import the web3-blockchain framework
impor "web3" sebagai web3

// Create a new blockchain
buat blockchain = web3.rantai_blok.RantaiBlok()
tampilkan("Blockchain dibuat dengan " + blockchain.blok.panjang + " blok")

// Create accounts
buat akun1 = web3.akun.Akun()
akun1.buat_baru()

buat akun2 = web3.akun.Akun()
akun2.buat_baru()

tampilkan("Akun1 alamat: " + akun1.alamat)
tampilkan("Akun2 alamat: " + akun2.alamat)
```

## Working with Accounts and Wallets

### Creating Accounts

```kodeon
// Create a new account
buat akun = web3.akun.Akun()
akun.buat_baru()

// Display account information
buat info = akun.dapatkan_info()
tampilkan("Alamat: " + info.alamat)
tampilkan("Kunci Publik: " + info.kunci_publik)

// Load account from private key
buat akun_dari_kunci = web3.akun.Akun()
akun_dari_kunci.muat_dari_kunci_pribadi("kunci_pribadi_anda")
```

### Creating Wallets

```kodeon
// Create a wallet
buat dompet = web3.dompet.Dompet()

// Create accounts in the wallet
buat akun1 = dompet.buat_akun()
buat akun2 = dompet.buat_akun()

// Get all accounts
buat semua_akun = dompet.dapatkan_semua_akun()
tampilkan("Jumlah akun dalam dompet: " + semua_akun.panjang)
```

## Working with Transactions

### Creating and Signing Transactions

```kodeon
// Create a transaction
buat transaksi = web3.transaksi.Transaksi(
    akun1.alamat,  // from
    akun2.alamat,  // to
    1000000000000000000,  // 1 ETH in wei
    "Transfer dana"  // data
)

// Sign the transaction
transaksi.tandatangani(akun1.kunci_pribadi)

// Verify the transaction
jika transaksi.apakah_valid():
    tampilkan("Transaksi valid")
lain:
    tampilkan("Transaksi tidak valid")
```

### Adding Transactions to Blockchain

```kodeon
// Add transaction to blockchain
blockchain.tambah_transaksi(transaksi)

// Mine pending transactions
blockchain.tambang_transaksi_pending(akun1.alamat)

// Check balances
buat saldo1 = blockchain.dapatkan_saldo_alamat(akun1.alamat)
buat saldo2 = blockchain.dapatkan_saldo_alamat(akun2.alamat)

tampilkan("Saldo akun1: " + web3.utilitas.wei_ke_ether(saldo1) + " ETH")
tampilkan("Saldo akun2: " + web3.utilitas.wei_ke_ether(saldo2) + " ETH")
```

## Smart Contracts

### Deploying a Smart Contract

```kodeon
// Create a provider (for connecting to a network)
buat penyedia = web3.penyedia_http.PenyediaHTTP("http://localhost:8545")
penyedia.hubungkan()

// Create Web3 instance
buat web3_instance = web3.buat_web3(penyedia)

// Deploy contract
buat abi = [...]  // Contract ABI
buat bytecode = "0x..."  // Contract bytecode

buat hasil_deploy = web3_instance.deploy_kontrak(abi, bytecode, [])
tampilkan("Kontrak dideploy di alamat: " + hasil_deploy.alamat_kontrak)
```

### Interacting with Smart Contracts

```kodeon
// Interact with deployed contract
buat kontrak = web3_instance.interaksi_kontrak(alamat_kontrak, abi)

// Call a read-only method
buat hasil = kontrak.panggil("getData", [], penyedia)
tampilkan("Hasil pemanggilan: " + hasil)

// Send a state-changing transaction
buat hash_transaksi = kontrak.kirim("setData", ["nilai_baru"], akun1, 0, penyedia)
tampilkan("Transaksi dikirim dengan hash: " + hash_transaksi)
```

## Providers

### HTTP Provider

```kodeon
// Create HTTP provider
buat penyedia_http = web3.penyedia_http.PenyediaHTTP("https://mainnet.infura.io/v3/YOUR_PROJECT_ID")
penyedia_http.hubungkan()

// Get accounts
buat akun = penyedia_http.dapatkan_akun()
tampilkan("Akun tersedia: " + akun)
```

### WebSocket Provider

```kodeon
// Create WebSocket provider
buat penyedia_ws = web3.penyedia_ws.PenyediaWS("wss://mainnet.infura.io/ws/v3/YOUR_PROJECT_ID")
penyedia_ws.hubungkan()

// Subscribe to new blocks
buat langganan = penyedia_ws.berlangganan("newBlockHeaders", fungsi(blok):
    tampilkan("Blok baru diterima: " + blok.hash)
)
```

## Cryptography

### Hash Functions

```kodeon
// SHA-256 hash
buat hash_sha256 = web3.hash.sha256("data untuk dihash")
tampilkan("SHA-256: " + hash_sha256)

// Keccak-256 hash (used in Ethereum)
buat hash_keccak = web3.hash.keccak256("data untuk dihash")
tampilkan("Keccak-256: " + hash_keccak)
```

### Digital Signatures

```kodeon
// Sign data
buat signature = web3.tanda_tangan.tandatangani("data untuk ditandatangani", kunci_pribadi)
tampilkan("Signature: " + signature)

// Verify signature
jika web3.tanda_tangan.verifikasi("data untuk ditandatangani", signature, kunci_publik):
    tampilkan("Signature valid")
lain:
    tampilkan("Signature tidak valid")
```

## Utilities

### Unit Conversion

```kodeon
// Convert Wei to Ether
buat ether = web3.utilitas.wei_ke_ether(1000000000000000000)
tampilkan("1 ETH = " + ether + " Wei")

// Convert Ether to Wei
buat wei = web3.utilitas.ether_ke_wei(1)
tampilkan("1 Wei = " + wei + " ETH")
```

### Address Validation

```kodeon
// Validate address
jika web3.utilitas.validasi_alamat("0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4C"):
    tampilkan("Alamat valid")
lain:
    tampilkan("Alamat tidak valid")
```

## Best Practices

1. **Secure Private Keys**: Never expose private keys in your code
2. **Validate Addresses**: Always validate blockchain addresses before use
3. **Handle Errors**: Check return values and handle potential errors appropriately
4. **Use Providers**: Connect to established blockchain networks for real applications
5. **Test Thoroughly**: Blockchain operations are irreversible, so test thoroughly

## Next Steps

-   Explore the [examples](../examples/) directory for more complex implementations
-   Read the [API Reference](api-reference.md) for detailed information about all available methods
-   Learn about [smart contracts](smart-contracts.md) and their deployment
-   Check out [DApp development](dapp-development.md) for building decentralized applications
