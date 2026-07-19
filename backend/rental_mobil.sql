drop database if exists Rental_mobil;
create database Rental_mobil_dinas;
use Rental_mobil_dinas;
show  databases;


create table roles(
   id_role int auto_increment primary key,                                              #id role(otomatis bertambah)
   nama_role varchar(30) not null                                                       #nama hak akses (Admin,pegawai,pimpinan)
);

delete from roles;                                                                   #menghapus isi table roles

insert into roles (nama_role)
values
    ('Admin'),
    ('Pegawai'),
    ('Pimpinan');

select * from roles;                                                               #menampilkan rolesnya
alter table roles auto_increment = 1;                                              #kayak menekan tombol reset. untuk ngulang dr no 1. intinya id berikutnya, dimulai dr angka 1.

-- ============================================
-- Membuat table user ADMIN
-- ============================================
create table users (
    id_user int auto_increment primary key,                                           #id pengguna
    id_role int not null,                                                             #menentukan apakah Admin, pegawai, pimpinan.
    nama_lengkap varchar(100) not null,                                               #Nama Pengguna
    nip varchar(30) unique,                                                           #Nomor induk pegawai
    username varchar(50) unique not null,                                             #username saat login
    password varchar(255) not null,                                                   #password (nanti di node.js disimpan dalam bentuk hash)
    email varchar(70),                                                                #email pengguna
    no_hp varchar(20),
    status ENUM('Aktif', 'Nonaktif') default 'Aktif',                                 #status akun
    created_at timestamp default current_timestamp,                                   #waktu akun dibuat

    foreign key (id_role)
    references roles(id_role)
    );

show tables;
desc users;                                                                     #menampilkan struktur sebuah table (dr table user)

-- ISI DATA ADMIN
delete from users;
alter table users AUTO_INCREMENT = 1;

insert into users                                                               #menambahkan data ke tabel users.
(id_role,nama_lengkap,nip,username,password,email,no_hp)                        #menentukan kolom mana saja yang akan di isi
values                                                                          #nilai yg dimasukan ke setiap kolom
    (
    1,                                                                              #ini adalah kode atau user memiliki role 1(angka 1/kode 1) yg dimana disitem no 1 adalah admin.
    'Admin Dion',                                                                   #nama lengkap  pengguna/nama admin
    '197812122005011001',                                                           #nip
    'admin',                                                                        #ini adlh usernamenya
    'admin123',                                                                     #passwordnya.  (untuk database, nanti diaplikasi akan i enkripsi)
    'admin@pemda.go.id',                                                            #email admin
    '081243714861'                                                                  #no.tlp admin
    );
select * from users;


-- ============================
-- MEMBUAT TABLE MOBIL
-- ============================
create table mobil(
    id_mobil int auto_increment primary key,
    plat_nomor varchar(13) not null unique,
    merk varchar(30) not null,
    tipe varchar(35) not null,
    tahun year not null,
    warna varchar(25) not null,
    kapasitas int not null,
    status ENUM('Tersedia','Dipakai','Servis') default 'Tersedia',
    foto varchar(255),
    created_at timestamp default current_timestamp
);

insert into mobil
(plat_nomor, merk, tipe, tahun, warna, kapasitas, status)
values
    ('AA 1234 AB', 'Toyota', 'Innova reborn', 2023, 'Hitam', 7, 'Tersedia'),
    ('AA 5436 BB', 'Toyota', 'Avanza', 2022, 'Putih', 7, 'Tersedia'),
    ('AA 1231 AA', 'Mitsubishi', 'Pajero Sport', 2024, 'Hitam', 7, 'Dipakai');
select * from mobil;
DESCRIBE mobil;

-- =============================================
-- MEMBUAT TABLE SOPIR
-- =============================================
CREATE TABLE sopir (
    id_sopir INT AUTO_INCREMENT PRIMARY KEY,                                    #Membuat kolom ID sopir.
    nama_sopir VARCHAR(100) NOT NULL,                                            #
    no_hp VARCHAR(20) NOT NULL,
    alamat TEXT,
    no_sim VARCHAR(20) NOT NULL UNIQUE,                                         #Menggunakan UNIQUE karena satu nomor SIM tidak boleh dimiliki dua sopir.
    status ENUM('Tersedia','Bertugas','Cuti') DEFAULT 'Tersedia',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP                              #Database otomatis menyimpan tanggal dan waktu ketika data sopir ditambahkan.
);

INSERT INTO sopir
    (nama_sopir, no_hp, alamat, no_sim, status)
VALUES
    (
        'Andi Saputra',
        '081234567890',
        'Jl. Merdeka No.10 Kebumen',
        'SIMA123456',
        'Tersedia'
    ),
    (
        'Budi Santoso',
        '081345678901',
        'Jl. Ahmad Yani No.20 Kebumen',
        'SIMB654321',
        'Bertugas'
    ),
    (
        'Eko Prasetyo',
        '081456789012',
        'Jl. Pahlawan No.15 Kebumen',
        'SIMC987654',
        'Cuti'
    );
SELECT * FROM sopir;
DESCRIBE sopir;


-- ==================================
-- MEMBUAT TABLE PENGAJUAN RENTAL
-- ==================================rental_mobil_dinas
create  table pengajuan_rental (
        id_pengajuan int auto_increment primary key ,

        id_user int not null,
        id_mobil int not null,
        unit_kerja VARCHAR(100),

        butuh_sopir ENUM('Ya','Tidak') DEFAULT 'Tidak',
        id_sopir int null,

        tujuan varchar(200) not null,
        keperluan TEXT not null,

        tanggal_berangkat date not null,
        tanggal_kembali date not null,

        jumlah_penumpang int not null,

        status ENUM('Menunggu', 'Disetujui', 'Ditolak')
    default  'Menunggu',

        created_at TIMESTAMP default current_timestamp,

        foreign key (id_user) references users(id_user),
        foreign key (id_mobil)references mobil(id_mobil),
        foreign key (id_sopir)references sopir(id_sopir)
);
DESC pengajuan_rental;

INSERT INTO pengajuan_rental
(id_user, id_mobil, id_sopir, tujuan, keperluan,
 tanggal_berangkat, tanggal_kembali,
 jumlah_penumpang)
VALUES
    (
        1,
        1,
        null,
        'Kantor Gubernur Jawa Tengah',
        'Rapat Koordinasi',
        '2026-07-20',
        '2026-07-20',
        5
    );
select * from pengajuan_rental;
SHOW COLUMNS FROM pengajuan_rental;
delete from pengajuan_rental;
alter table pengajuan_rental AUTO_INCREMENT = 1;
DESCRIBE pengajuan_rental;


-- ==============================================
-- MEMBUAT TABEL APPROVAL
-- MENYIMPAN PROSES PERSETUJUAN PENGAJUAN RENTAL
-- ==============================================
create table approval (
    id_approval int auto_increment primary key ,

    id_pengajuan int not null,                                                                      #pengajuan yang diproses
    id_admin int not null,                                                                                                #admin yang memproses

    status Enum('Disetujui', 'Ditolak') not null,

    catatan text,                                                                                   #alasan atau komentar admin

    tanggal_approval timestamp default current_timestamp,

    foreign key (id_pengajuan) references  pengajuan_rental(id_pengajuan),
    foreign key (id_admin) references users(id_user)
);
desc approval;

insert into approval(
    id_pengajuan, id_admin, status, catatan
)  values
    (1,
     1,
     'Disetujui',
     'Pengajuan disetujui, kendaraan siap digunakan.'
    );
select * from approval;
delete from approval;
alter table approval AUTO_INCREMENT = 1;
DESCRIBE approval;

-- =========================================================
-- TABEL PENGEMBALIAN
-- MENYIMPAN DATA PENGEMBALIAN MOBIL DINAS
-- =========================================================
CREATE TABLE pengembalian (
       id_pengembalian INT AUTO_INCREMENT PRIMARY KEY,
       id_pengajuan INT NOT NULL,

       tanggal_kembali_aktual DATE NOT NULL,

       kondisi_mobil ENUM(
      'Baik',
      'Kotor',
      'Rusak Ringan',
      'Rusak Berat'
) DEFAULT 'Baik',

      catatan TEXT,

      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

      FOREIGN KEY (id_pengajuan)
      REFERENCES pengajuan_rental(id_pengajuan)
);
INSERT INTO pengembalian
(
    id_pengajuan,
    tanggal_kembali_aktual,
    kondisi_mobil,
    catatan
)
VALUES
    (
        1,
        '2026-07-20',
        'Baik',
        'Mobil dikembalikan tepat waktu.'
    );
select * from pengembalian;

