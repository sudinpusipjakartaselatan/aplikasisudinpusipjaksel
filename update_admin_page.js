const fs = require('fs');

const path = 'c:/Users/ASUS/Documents/Projek Mas Farid/aplikasisudinpusipjaksel/app/admin/page.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Update State
const stateReplacement = `
  // Mobile Library Form State
  const [mlPetugas, setMlPetugas] = useState('');
  const [mlNoPolisi, setMlNoPolisi] = useState('');
  const [mlHari, setMlHari] = useState('');
  const [mlTanggal, setMlTanggal] = useState('');
  const [mlJamLayanan, setMlJamLayanan] = useState('');
  const [mlKecamatan, setMlKecamatan] = useState('');
  const [mlKelurahan, setMlKelurahan] = useState('');
  const [mlNamaLokasi, setMlNamaLokasi] = useState('');
  const [mlAlamatTelepon, setMlAlamatTelepon] = useState('');
  const [mlJarakKeLokasi1, setMlJarakKeLokasi1] = useState('');
  const [mlJarakLokasi1Ke2, setMlJarakLokasi1Ke2] = useState('');
  const [mlJarakKembali, setMlJarakKembali] = useState('');
  const [mlTotalJarak, setMlTotalJarak] = useState('');
  const [mlNamaPimpinan, setMlNamaPimpinan] = useState('');
  const [mlNamaPIC, setMlNamaPIC] = useState('');
  const [mlImageUrl, setMlImageUrl] = useState('');
  
  // Legacy
  const [mlTitle, setMlTitle] = useState('');
  const [mlDate, setMlDate] = useState('');
  const [mlTime, setMlTime] = useState('');
  const [mlLocation, setMlLocation] = useState('');
  const [mlDescription, setMlDescription] = useState('');
`;
content = content.replace(/\/\/ Mobile Library Form State[\s\S]*?(?=const \[isSubmitting, setIsSubmitting\] = useState\(false\);)/, stateReplacement);

// 2. Add Excel Handlers for ML
const mlExcelHandlers = `
  const handleExcelUploadMl = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsSubmitting(true);
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      
      if (!jsonData || jsonData.length === 0) {
        showAlert('error', 'Gagal Import', 'File Excel kosong atau format tidak sesuai');
        setIsSubmitting(false);
        return;
      }
      
      const mappedData = jsonData.map((row: any) => ({
        petugas: row['Petugas'] || '',
        noPolisi: row['No. Polisi'] || '',
        hari: row['Hari'] || '',
        tanggal: row['Tanggal'] || '',
        jamLayanan: row['Jam Layanan'] || '',
        kecamatan: row['Kecamatan'] || '',
        kelurahan: row['Kelurahan'] || '',
        namaLokasi: row['Nama Lokasi'] || '',
        alamatTelepon: row['Alamat dan Nomor Telepon Lokasi'] || '',
        jarakKeLokasi1: row['Jarak Dari Sudin Pusip JS Ke Lokasi 1 (km)'] || '',
        jarakLokasi1Ke2: row['Jarak Dari Lokasi 1 Ke Lokasi 2 (km)'] || '',
        jarakKembali: row['Jarak Dari Lokasi 2 Kembali Ke Sudin Pusip JS'] || '',
        totalJarak: row['Total Jarak Tempuh'] || '',
        namaPimpinan: row['Nama Pimpinan Instansi'] || '',
        namaPIC: row['Nama dan Nomor PIC'] || '',
        imageUrl: row['Gambar'] || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%2394a3b8"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-1.1 0-2 .9-2 2v8c0 .6.4 1 1 1h2m-6 0h6m-14 0h6m-14 0H3v-8h16m-4 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm-10 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" stroke="%2394a3b8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
      }));
      
      const res = await fetch('/api/mobile-libraries/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mappedData)
      });
      
      if (res.ok) {
        showAlert('success', 'Berhasil', \`Berhasil mengimpor \${mappedData.length} data pusling\`);
        fetchData();
      } else {
        showAlert('error', 'Gagal', 'Gagal mengimpor data pusling');
      }
    } catch (error) {
      console.error(error);
      showAlert('error', 'Error', 'Terjadi kesalahan saat memproses file Excel');
    } finally {
      setIsSubmitting(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDownloadExcelMl = () => {
    if (mobileLibraries.length === 0) {
      showAlert('error', 'Gagal', 'Tidak ada data pusling untuk diunduh');
      return;
    }

    const dataToExport = mobileLibraries.map((item) => ({
      'Petugas': item.petugas || '',
      'No. Polisi': item.noPolisi || '',
      'Hari': item.hari || '',
      'Tanggal': item.tanggal || item.date || '',
      'Jam Layanan': item.jamLayanan || item.time || '',
      'Kecamatan': item.kecamatan || '',
      'Kelurahan': item.kelurahan || '',
      'Nama Lokasi': item.namaLokasi || item.title || item.location || '',
      'Alamat dan Nomor Telepon Lokasi': item.alamatTelepon || '',
      'Jarak Dari Sudin Pusip JS Ke Lokasi 1 (km)': item.jarakKeLokasi1 || '',
      'Jarak Dari Lokasi 1 Ke Lokasi 2 (km)': item.jarakLokasi1Ke2 || '',
      'Jarak Dari Lokasi 2 Kembali Ke Sudin Pusip JS': item.jarakKembali || '',
      'Total Jarak Tempuh': item.totalJarak || '',
      'Nama Pimpinan Instansi': item.namaPimpinan || '',
      'Nama dan Nomor PIC': item.namaPIC || '',
      'Gambar': item.imageUrl || ''
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data Pusling");
    
    XLSX.writeFile(workbook, "Data_Pusling_Sudin_Pusip_Jaksel.xlsx");
  };
`;
content = content.replace(/(const handleDownloadExcel = \(\) => {[\s\S]*?};)/, `$1\n\n${mlExcelHandlers}`);

// 3. Update handleSubmitMobileLib
const mlSubmitHandler = `const handleSubmitMobileLib = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);
      const defaultImg = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%2394a3b8"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-1.1 0-2 .9-2 2v8c0 .6.4 1 1 1h2m-6 0h6m-14 0h6m-14 0H3v-8h16m-4 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm-10 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" stroke="%2394a3b8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      const finalImg = mlImageUrl || defaultImg;
      const mlData = { 
        petugas: mlPetugas, noPolisi: mlNoPolisi, hari: mlHari, tanggal: mlTanggal, jamLayanan: mlJamLayanan, kecamatan: mlKecamatan, kelurahan: mlKelurahan, namaLokasi: mlNamaLokasi, alamatTelepon: mlAlamatTelepon, jarakKeLokasi1: mlJarakKeLokasi1, jarakLokasi1Ke2: mlJarakLokasi1Ke2, jarakKembali: mlJarakKembali, totalJarak: mlTotalJarak, namaPimpinan: mlNamaPimpinan, namaPIC: mlNamaPIC, imageUrl: finalImg,
        // fallback legacy
        title: mlNamaLokasi, date: mlTanggal, time: mlJamLayanan, location: mlKelurahan, description: mlAlamatTelepon
      };
      try {
        const res = await fetch(editingId ? \`/api/mobile-libraries/\${editingId}\` : '/api/mobile-libraries', { method: editingId ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(mlData) });
        if (res.ok) { setShowAddForm(false); resetForm(); fetchData(); showAlert('success', 'Berhasil', 'Jadwal pusling berhasil disimpan'); } else showAlert('error', 'Gagal', 'Gagal menyimpan jadwal pusling');
      } catch (err) { console.error(err); showAlert('error', 'Error', 'Terjadi kesalahan'); } finally { setIsSubmitting(false); }
    };`;
content = content.replace(/const handleSubmitMobileLib = async \(e: React.FormEvent\) => {[\s\S]*?};/, mlSubmitHandler);

// 4. Update handleEditMobileLib
const handleEditMl = `const handleEditMobileLib = (ml: MobileLibrary) => {
    setEditingId(ml.id); 
    setMlPetugas(ml.petugas || '');
    setMlNoPolisi(ml.noPolisi || '');
    setMlHari(ml.hari || '');
    setMlTanggal(ml.tanggal || ml.date || '');
    setMlJamLayanan(ml.jamLayanan || ml.time || '');
    setMlKecamatan(ml.kecamatan || '');
    setMlKelurahan(ml.kelurahan || '');
    setMlNamaLokasi(ml.namaLokasi || ml.title || ml.location || '');
    setMlAlamatTelepon(ml.alamatTelepon || '');
    setMlJarakKeLokasi1(ml.jarakKeLokasi1?.toString() || '');
    setMlJarakLokasi1Ke2(ml.jarakLokasi1Ke2?.toString() || '');
    setMlJarakKembali(ml.jarakKembali?.toString() || '');
    setMlTotalJarak(ml.totalJarak?.toString() || '');
    setMlNamaPimpinan(ml.namaPimpinan || '');
    setMlNamaPIC(ml.namaPIC || '');
    setMlImageUrl(ml.imageUrl || '');
    setShowAddForm(true); window.scrollTo({ top: 0, behavior: 'smooth' });
  };`;
content = content.replace(/const handleEditMobileLib = \(ml: MobileLibrary\) => {[\s\S]*?};/, handleEditMl);

// 5. Update resetForm
const resetFormMl = `setMlPetugas(''); setMlNoPolisi(''); setMlHari(''); setMlTanggal(''); setMlJamLayanan(''); setMlKecamatan(''); setMlKelurahan(''); setMlNamaLokasi(''); setMlAlamatTelepon(''); setMlJarakKeLokasi1(''); setMlJarakLokasi1Ke2(''); setMlJarakKembali(''); setMlTotalJarak(''); setMlNamaPimpinan(''); setMlNamaPIC(''); setMlImageUrl('');`;
content = content.replace(/setMlTitle\(''\); setMlDate\(''\); setMlTime\(''\); setMlLocation\(''\); setMlImageUrl\(''\); setMlDescription\(''\);/, resetFormMl);

// 6. Fix Import/Export Buttons for Mobile Library
const importExportButtons = `{activeTab === 'kegiatan' && !showAddForm && (
                <>
                  <button onClick={handleDownloadExcel} className="w-full sm:w-auto bg-slate-800 text-white px-6 md:px-8 py-3 md:py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-700 transition-all shadow-xl hover:shadow-slate-800/20">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Export Excel
                  </button>
                  <input type="file" ref={fileInputRef} onChange={handleExcelUpload} accept=".xlsx, .xls" className="hidden" />
                  <button onClick={() => fileInputRef.current?.click()} className="w-full sm:w-auto bg-green-500 text-white px-6 md:px-8 py-3 md:py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-green-600 transition-all shadow-xl hover:shadow-green-500/20" disabled={isSubmitting}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg> Import Excel
                  </button>
                </>
              )}
              {activeTab === 'mobile_libraries' && !showAddForm && (
                <>
                  <button onClick={handleDownloadExcelMl} className="w-full sm:w-auto bg-slate-800 text-white px-6 md:px-8 py-3 md:py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-700 transition-all shadow-xl hover:shadow-slate-800/20">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Export Excel
                  </button>
                  <input type="file" ref={fileInputRef} onChange={handleExcelUploadMl} accept=".xlsx, .xls" className="hidden" />
                  <button onClick={() => fileInputRef.current?.click()} className="w-full sm:w-auto bg-green-500 text-white px-6 md:px-8 py-3 md:py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-green-600 transition-all shadow-xl hover:shadow-green-500/20" disabled={isSubmitting}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg> Import Excel
                  </button>
                </>
              )}`;
content = content.replace(/{activeTab === 'kegiatan' && !showAddForm && \([\s\S]*?<\/>\n\s*\)}/, importExportButtons);


// 7. Update form for ML
const mlForm = `<form onSubmit={handleSubmitMobileLib} className="space-y-6 md:space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  <div><label className="block text-sm font-bold text-slate-700 mb-2.5">Petugas</label><input type="text" value={mlPetugas} onChange={(e) => setMlPetugas(e.target.value)} className="w-full px-4 py-3 rounded-2xl border border-slate-200" placeholder="Petugas..." /></div>
                  <div><label className="block text-sm font-bold text-slate-700 mb-2.5">No. Polisi</label><input type="text" value={mlNoPolisi} onChange={(e) => setMlNoPolisi(e.target.value)} className="w-full px-4 py-3 rounded-2xl border border-slate-200" placeholder="B 1234 CD" /></div>
                  <div><label className="block text-sm font-bold text-slate-700 mb-2.5">Hari</label><input type="text" value={mlHari} onChange={(e) => setMlHari(e.target.value)} className="w-full px-4 py-3 rounded-2xl border border-slate-200" placeholder="Senin" /></div>
                  <div><label className="block text-sm font-bold text-slate-700 mb-2.5">Tanggal</label><input type="text" value={mlTanggal} onChange={(e) => setMlTanggal(e.target.value)} className="w-full px-4 py-3 rounded-2xl border border-slate-200" placeholder="15 Oktober 2026" /></div>
                  <div><label className="block text-sm font-bold text-slate-700 mb-2.5">Jam Layanan</label><input type="text" value={mlJamLayanan} onChange={(e) => setMlJamLayanan(e.target.value)} className="w-full px-4 py-3 rounded-2xl border border-slate-200" placeholder="09:00 - 12:00" /></div>
                  <div><label className="block text-sm font-bold text-slate-700 mb-2.5">Kecamatan</label><input type="text" value={mlKecamatan} onChange={(e) => setMlKecamatan(e.target.value)} className="w-full px-4 py-3 rounded-2xl border border-slate-200" placeholder="Kecamatan..." /></div>
                  <div><label className="block text-sm font-bold text-slate-700 mb-2.5">Kelurahan</label><input type="text" value={mlKelurahan} onChange={(e) => setMlKelurahan(e.target.value)} className="w-full px-4 py-3 rounded-2xl border border-slate-200" placeholder="Kelurahan..." /></div>
                  <div><label className="block text-sm font-bold text-slate-700 mb-2.5">Nama Lokasi</label><input type="text" value={mlNamaLokasi} onChange={(e) => setMlNamaLokasi(e.target.value)} className="w-full px-4 py-3 rounded-2xl border border-slate-200" placeholder="Nama Lokasi..." required /></div>
                  <div><label className="block text-sm font-bold text-slate-700 mb-2.5">Alamat dan Nomor Telepon Lokasi</label><input type="text" value={mlAlamatTelepon} onChange={(e) => setMlAlamatTelepon(e.target.value)} className="w-full px-4 py-3 rounded-2xl border border-slate-200" placeholder="Alamat & No Telp..." /></div>
                  
                  <div><label className="block text-sm font-bold text-slate-700 mb-2.5">Jarak Ke Lokasi 1 (km)</label><input type="number" step="0.1" value={mlJarakKeLokasi1} onChange={(e) => setMlJarakKeLokasi1(e.target.value)} className="w-full px-4 py-3 rounded-2xl border border-slate-200" placeholder="0" /></div>
                  <div><label className="block text-sm font-bold text-slate-700 mb-2.5">Jarak Lokasi 1 Ke 2 (km)</label><input type="number" step="0.1" value={mlJarakLokasi1Ke2} onChange={(e) => setMlJarakLokasi1Ke2(e.target.value)} className="w-full px-4 py-3 rounded-2xl border border-slate-200" placeholder="0" /></div>
                  <div><label className="block text-sm font-bold text-slate-700 mb-2.5">Jarak Kembali (km)</label><input type="number" step="0.1" value={mlJarakKembali} onChange={(e) => setMlJarakKembali(e.target.value)} className="w-full px-4 py-3 rounded-2xl border border-slate-200" placeholder="0" /></div>
                  <div><label className="block text-sm font-bold text-slate-700 mb-2.5">Total Jarak Tempuh</label><input type="number" step="0.1" value={mlTotalJarak} onChange={(e) => setMlTotalJarak(e.target.value)} className="w-full px-4 py-3 rounded-2xl border border-slate-200" placeholder="0" /></div>
                  
                  <div><label className="block text-sm font-bold text-slate-700 mb-2.5">Nama Pimpinan Instansi</label><input type="text" value={mlNamaPimpinan} onChange={(e) => setMlNamaPimpinan(e.target.value)} className="w-full px-4 py-3 rounded-2xl border border-slate-200" placeholder="Pimpinan..." /></div>
                  <div><label className="block text-sm font-bold text-slate-700 mb-2.5">Nama dan Nomor PIC</label><input type="text" value={mlNamaPIC} onChange={(e) => setMlNamaPIC(e.target.value)} className="w-full px-4 py-3 rounded-2xl border border-slate-200" placeholder="PIC..." /></div>
                </div>
                <div><label className="block text-sm font-bold text-slate-700 mb-2.5">Tautan Gambar Armada / Suasana (Kosongkan untuk Default)</label><div className="flex flex-col sm:flex-row gap-4"><input type="text" value={mlImageUrl} onChange={(e) => setMlImageUrl(e.target.value)} className="flex-1 px-4 md:px-5 py-3 md:py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-slate-600 font-medium" placeholder="https://..." /><div className="w-14 h-14 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center shrink-0 overflow-hidden bg-slate-50">{mlImageUrl ? <img src={mlImageUrl} alt="Preview" className="w-full h-full object-cover" /> : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6 text-slate-300"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-1.1 0-2 .9-2 2v8c0 .6.4 1 1 1h2m-6 0h6m-14 0h6m-14 0H3v-8h16m-4 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm-10 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" /></svg>}</div></div></div>
                <div className="flex gap-4 pt-4"><button type="submit" disabled={isSubmitting} className={\`flex-1 py-4 md:py-5 rounded-2xl font-extrabold text-white transition-all shadow-lg text-sm md:text-base flex items-center justify-center gap-3 \${isSubmitting ? 'bg-slate-400 cursor-not-allowed' : 'bg-primary hover:bg-primary-light hover:-translate-y-1 active:translate-y-0 shadow-primary/20'}\`}>{isSubmitting ? <><svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Memproses Data...</> : (editingId ? 'Simpan Perubahan' : 'Publikasikan Jadwal')}</button></div>
              </form>`;
content = content.replace(/<form onSubmit={handleSubmitMobileLib}[\s\S]*?<\/form>/, mlForm);

// 8. Update Mobile Library List mapping
const tableContent = `<td className="px-5 md:px-6 py-4 md:py-5 align-top pt-5">
                        <div className="flex flex-col gap-1">
                          <span className="text-sm font-semibold text-slate-700 whitespace-pre-wrap">{item.namaLokasi || item.title || item.location}</span>
                          {item.kelurahan && <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md w-fit">Kelurahan: {item.kelurahan}</span>}
                        </div>
                      </td>
                      <td className="px-5 md:px-6 py-4 md:py-5 align-top pt-5">
                        <div className="flex flex-col gap-1">
                          <span className="text-sm font-bold text-slate-800">{item.hari ? item.hari + ', ' : ''}{item.tanggal || item.date}</span>
                          <span className="text-xs text-slate-500 flex items-center gap-1">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                            {item.jamLayanan || item.time}
                          </span>
                        </div>
                      </td>`;

const mlListBlock = `{activeTab === 'mobile_libraries' && mobileLibraries.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-5 md:px-6 py-4 md:py-5">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl bg-slate-100 overflow-hidden shrink-0 shadow-sm flex items-center justify-center border border-slate-200">
                            {item.imageUrl ? (
                              <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6 text-slate-400"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-1.1 0-2 .9-2 2v8c0 .6.4 1 1 1h2m-6 0h6m-14 0h6m-14 0H3v-8h16m-4 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm-10 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" /></svg>
                            )}
                          </div>
                          <div className="flex flex-col min-w-0 pt-0.5">
                            <span className="font-bold text-slate-800 text-sm md:text-base line-clamp-2 leading-tight group-hover:text-primary transition-colors">{item.namaLokasi || item.title}</span>
                            {(item.petugas || item.noPolisi) && <span className="text-xs text-slate-500 mt-1 line-clamp-1">Petugas: {item.petugas} | No: {item.noPolisi}</span>}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 md:px-6 py-4 md:py-5 align-top pt-5">
                        <div className="flex flex-col gap-1">
                          <span className="text-sm font-semibold text-slate-700 whitespace-pre-wrap">{item.namaLokasi || item.location}</span>
                          {item.kelurahan && <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md w-fit">Kelurahan: {item.kelurahan}</span>}
                        </div>
                      </td>
                      <td className="px-5 md:px-6 py-4 md:py-5 align-top pt-5">
                        <div className="flex flex-col gap-1">
                          <span className="text-sm font-bold text-slate-800">{item.hari ? item.hari + ', ' : ''}{item.tanggal || item.date}</span>
                          <span className="text-xs text-slate-500 flex items-center gap-1">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                            {item.jamLayanan || item.time}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 md:px-6 py-4 md:py-5 align-middle text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handleEditMobileLib(item)} className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-400 hover:bg-amber-100 hover:text-amber-600 transition-all bg-white border border-slate-200 hover:border-amber-200" title="Edit">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                          </button>
                          <button onClick={() => handleDeleteMobileLib(item.id)} className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-400 hover:bg-red-100 hover:text-red-600 transition-all bg-white border border-slate-200 hover:border-red-200" title="Hapus">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
`;
content = content.replace(/{activeTab === 'mobile_libraries' && mobileLibraries\.map\(\(item\) => \([\s\S]*?\)\)}/, mlListBlock);

fs.writeFileSync(path, content, 'utf8');
