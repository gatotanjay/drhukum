import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Shield, Eye, FileText, AlertTriangle, Scale, Users } from 'lucide-react';

const Terms = () => {
  const sections = [
    {
      id: 'terms',
      title: 'Syarat & Ketentuan',
      icon: FileText,
      content: [
        {
          subtitle: '1. Penerimaan Syarat',
          text: 'Dengan menggunakan layanan DrHukum, Anda menyetujui untuk terikat oleh syarat dan ketentuan ini. Jika Anda tidak setuju dengan syarat ini, mohon untuk tidak menggunakan layanan kami.'
        },
        {
          subtitle: '2. Layanan Hukum',
          text: 'DrHukum menyediakan layanan konsultasi hukum, representasi legal, dan layanan terkait lainnya. Semua layanan diberikan sesuai dengan hukum yang berlaku di Indonesia dan kode etik profesi advokat.'
        },
        {
          subtitle: '3. Hubungan Klien-Advokat',
          text: 'Hubungan klien-advokat terbentuk setelah penandatanganan perjanjian layanan hukum. Sebelum itu, komunikasi yang terjadi bersifat konsultasi umum dan tidak menciptakan hubungan hukum yang mengikat.'
        },
        {
          subtitle: '4. Kerahasiaan',
          text: 'Kami berkomitmen menjaga kerahasiaan semua informasi yang diberikan klien sesuai dengan privilege attorney-client dan peraturan perundang-undangan yang berlaku.'
        },
        {
          subtitle: '5. Pembayaran dan Biaya',
          text: 'Struktur biaya akan dijelaskan secara transparan sebelum layanan dimulai. Pembayaran dilakukan sesuai dengan kesepakatan dalam perjanjian layanan hukum.'
        },
        {
          subtitle: '6. Batasan Tanggung Jawab',
          text: 'DrHukum tidak bertanggung jawab atas kerugian yang timbul akibat keterlambatan atau kegagalan dalam memberikan layanan yang disebabkan oleh force majeure atau faktor di luar kendali kami.'
        },
        {
          subtitle: '7. Perubahan Syarat',
          text: 'Kami berhak mengubah syarat dan ketentuan ini sewaktu-waktu. Perubahan akan diberitahukan melalui website atau komunikasi langsung kepada klien.'
        }
      ]
    },
    {
      id: 'privacy',
      title: 'Kebijakan Privasi',
      icon: Shield,
      content: [
        {
          subtitle: '1. Pengumpulan Informasi',
          text: 'Kami mengumpulkan informasi yang Anda berikan secara langsung, seperti nama, alamat email, nomor telepon, dan detail kasus hukum untuk memberikan layanan yang optimal.'
        },
        {
          subtitle: '2. Penggunaan Informasi',
          text: 'Informasi yang dikumpulkan digunakan untuk: memberikan layanan hukum, komunikasi dengan klien, pemrosesan pembayaran, dan peningkatan kualitas layanan.'
        },
        {
          subtitle: '3. Perlindungan Data',
          text: 'Kami menerapkan langkah-langkah keamanan teknis dan organisasi yang sesuai untuk melindungi data pribadi Anda dari akses, penggunaan, atau pengungkapan yang tidak sah.'
        },
        {
          subtitle: '4. Pembagian Informasi',
          text: 'Kami tidak akan membagikan informasi pribadi Anda kepada pihak ketiga tanpa persetujuan Anda, kecuali diwajibkan oleh hukum atau untuk kepentingan penegakan hukum.'
        },
        {
          subtitle: '5. Cookies dan Teknologi Pelacakan',
          text: 'Website kami menggunakan cookies untuk meningkatkan pengalaman pengguna. Anda dapat mengatur preferensi cookies melalui pengaturan browser Anda.'
        },
        {
          subtitle: '6. Hak Anda',
          text: 'Anda memiliki hak untuk mengakses, memperbarui, mengoreksi, atau menghapus data pribadi Anda. Hubungi kami untuk menggunakan hak-hak tersebut.'
        },
        {
          subtitle: '7. Retensi Data',
          text: 'Kami menyimpan data pribadi Anda selama diperlukan untuk memberikan layanan dan mematuhi kewajiban hukum, biasanya selama 7 tahun setelah berakhirnya hubungan klien-advokat.'
        }
      ]
    },
    {
      id: 'disclaimer',
      title: 'Disclaimer',
      icon: AlertTriangle,
      content: [
        {
          subtitle: '1. Sifat Informasi',
          text: 'Informasi yang disediakan di website ini bersifat umum dan tidak dimaksudkan sebagai nasihat hukum spesifik. Setiap situasi hukum adalah unik dan memerlukan analisis individual.'
        },
        {
          subtitle: '2. Tidak Ada Jaminan Hasil',
          text: 'Kami tidak dapat menjamin hasil tertentu dalam kasus hukum. Hasil bergantung pada berbagai faktor termasuk fakta kasus, hukum yang berlaku, dan keputusan pengadilan.'
        },
        {
          subtitle: '3. Informasi Website',
          text: 'Meskipun kami berusaha menjaga keakuratan informasi di website, kami tidak bertanggung jawab atas kesalahan, kelalaian, atau ketidakakuratan informasi yang mungkin terjadi.'
        },
        {
          subtitle: '4. Link Eksternal',
          text: 'Website kami mungkin berisi link ke website pihak ketiga. Kami tidak bertanggung jawab atas konten atau praktik privasi website tersebut.'
        },
        {
          subtitle: '5. Yurisdiksi',
          text: 'Syarat dan ketentuan ini diatur oleh hukum Indonesia. Setiap sengketa akan diselesaikan melalui pengadilan yang berwenang di Indonesia.'
        },
        {
          subtitle: '6. Konsultasi Profesional',
          text: 'Selalu konsultasikan masalah hukum spesifik Anda dengan advokat yang berkualifikasi. Jangan mengandalkan informasi umum untuk mengambil keputusan hukum penting.'
        }
      ]
    }
  ];

  return (
    <>
      <Helmet>
        <title>DrHukum Indonesia | Legal Services & Strategic Counsel</title>
        <meta name="description" content="DrHukum Indonesia provides practical legal services and strategic counsel for individuals and businesses, focusing on clarity, protection, and long-term solutions." />
        <meta property="og:title" content="DrHukum Indonesia | Legal Services & Strategic Counsel" />
        <meta property="og:description" content="DrHukum Indonesia provides practical legal services and strategic counsel for individuals and businesses, focusing on clarity, protection, and long-term solutions." />
      </Helmet>

      <div className="pt-16">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Syarat & <span className="gradient-text">Ketentuan</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Informasi penting mengenai syarat penggunaan layanan, kebijakan privasi, 
                dan disclaimer untuk melindungi hak dan kepentingan semua pihak.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Navigation */}
        <section className="py-8 bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-wrap justify-center gap-4"
            >
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="flex items-center space-x-2 px-6 py-3 bg-blue-50 text-blue-600 rounded-lghover:bg-blue-100 transition-colors duration-300"
                >
                  <section.icon className="h-5 w-5" />
                  <span className="font-medium">{section.title}</span>
                </a>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Content Sections */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {sections.map((section, sectionIndex) => (
              <motion.div
                key={section.id}
                id={section.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: sectionIndex * 0.2 }}
                className="mb-16"
              >
                <div className="flex items-center space-x-4 mb-8">
                  <div className="bg-blue-600 w-12 h-12 rounded-xl flex items-center justify-center">
                    <section.icon className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">{section.title}</h2>
                </div>

                <div className="space-y-8">
                  {section.content.map((item, itemIndex) => (
                    <motion.div
                      key={itemIndex}
                      initial={{ opacity: 0, x: -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.8, delay: itemIndex * 0.1 }}
                      className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        {item.subtitle}
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        {item.text}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Professional Standards */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Standar Profesional Kami
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Komitmen kami terhadap standar etika dan profesionalisme tertinggi
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center"
              >
                <div className="bg-blue-100 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <Scale className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Kode Etik Profesi</h3>
                <p className="text-gray-600">
                  Kami mematuhi kode etik advokat Indonesia dan standar internasional 
                  dalam memberikan layanan hukum.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-center"
              >
                <div className="bg-blue-100 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Kepentingan Klien</h3>
                <p className="text-gray-600">
                  Kepentingan klien adalah prioritas utama kami dalam setiap 
                  representasi dan layanan hukum yang diberikan.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-center"
              >
                <div className="bg-blue-100 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <Eye className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Transparansi</h3>
                <p className="text-gray-600">
                  Kami berkomitmen untuk transparan dalam komunikasi, biaya, 
                  dan proses hukum kepada semua klien.
                </p>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Terms;