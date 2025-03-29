import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { FaCamera, FaDumbbell, FaUserPlus, FaIdCard, FaBirthdayCake, FaBriefcase, FaHome, FaPhone, FaCalendarAlt, FaMoneyBillWave, FaShieldAlt, FaArrowRight } from 'react-icons/fa';
import { invoke } from '@tauri-apps/api/core';
import Flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { Arabic } from 'flatpickr/dist/l10n/ar';
import { motion } from 'framer-motion';
import { TextField, MenuItem, Button, Paper, Typography, Avatar, IconButton, Grid, Card, CardContent, CardActionArea } from '@mui/material';
import { styled } from '@mui/system';

const StyledPaper = styled(Paper)(({ theme }) => ({
  borderRadius: '12px',
  overflow: 'hidden',
  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '50px',
  padding: '10px 24px',
  fontWeight: 'bold',
  textTransform: 'none',
  transition: 'all 0.3s ease',
}));

const SportCard = styled(Card)(({ theme }) => ({
  minWidth: 200,
  textAlign: 'center',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
  },
}));

const Inscription = () => {
  const [formData, setFormData] = useState({
    id: '',
    last_name: '',
    first_name: '',
    date_naissance: '',
    cin: '',
    profession: '',
    adresse: '',
    photo: '',
    phone: '',
    registration_date: '',
    assirance: '',
    sport_type: '',
    price: '',
    start_date: '',
    end_date: '',
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedSport, setSelectedSport] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Références pour Flatpickr
  const dateNaissanceRef = useRef(null);
  const assiranceDateRef = useRef(null);
  const startDateRef = useRef(null);

  // Initialiser Flatpickr
  useEffect(() => {
    if (!showForm) return;

    const today = new Date();
    const flatpickrOptions = {
      locale: Arabic,
      dateFormat: 'd/m/Y',
      altInput: true,
      altFormat: 'd/m/Y',
      defaultDate: today,
    };

    Flatpickr(startDateRef.current, {
      ...flatpickrOptions,
      onChange: (selectedDates, dateStr) => {
        setFormData(prev => ({
          ...prev,
          start_date: dateStr,
          end_date: add30Days(dateStr),
        }));
      },
    });

    Flatpickr(dateNaissanceRef.current, { ...flatpickrOptions, defaultDate: null });
    Flatpickr(assiranceDateRef.current, flatpickrOptions);
  }, [showForm]);

  const add30Days = (dateStr) => {
    if (!dateStr) return '';
    const [day, month, year] = dateStr.split('/');
    const date = new Date(`${month}/${day}/${year}`);
    if (isNaN(date.getTime())) return '';
    date.setDate(date.getDate() + 30);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData(prev => ({
    ...prev,
    [name]: (name === 'price' || name === 'assirance') ? 
            (value === '' ? '' : value) : // Garde comme chaîne mais valide
            value,
  }));
};

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setFormData(prev => ({ ...prev, photo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
   if (!formData.id || formData.id.trim() === '') {
    alert('يرجى إدخال رقم العضوية');
    return;
  }
  //   if (!formData.date_naissance === '') {
  //   alert('يرجى إدخال تاريخ الازدياد');
  //   return;
  // }
  setIsSubmitting(true);
  
  try {
    const updatedFormData = {
      ...formData,
      assirance: formData.assirance === '' ? 0 : parseFloat(formData.assirance),
      price: formData.price === '' ? 0 : parseFloat(formData.price),
      end_date: formData.start_date ? add30Days(formData.start_date) : '',
    };
    
    // Vérification des nombres
    if (isNaN(updatedFormData.assirance) || isNaN(updatedFormData.price)) {
      throw new Error("Les montants doivent être des nombres valides");
    }

    await invoke('add_new_user', { 
      user: {
        ...updatedFormData,
        assirance: updatedFormData.assirance,
        price: updatedFormData.price
      } 
    });
    
    alert('تم التسجيل بنجاح !');
    // Reset form
    setFormData({
      // ... autres champs
      assirance: '',
      price: '',
      // ... autres champs
    });
    setPreviewImage(null);
    setShowForm(false);
    setSelectedSport(null);
  } catch (error) {
    console.error('Erreur:', error);
    alert(error.message || 'لقد حدث خطأ.');
  } finally {
    setIsSubmitting(false);
  }
};

  const handleSportSelect = (sport) => {
    setSelectedSport(sport);
    setFormData(prev => ({
      ...prev,
      sport_type: sport,
    }));
    setShowForm(true);
  };

  const sportOptions = [
    { value: 'الأيروبيك', label: 'الأيروبيك', icon: <FaDumbbell /> },
    { value: 'الملاكمة', label: 'الملاكمة', icon: <FaDumbbell /> },
    { value: 'اللياقة البدنية', label: 'اللياقة البدنية', icon: <FaDumbbell /> },
    { value: 'التايكوندو', label: 'التايكوندو', icon: <FaDumbbell /> },
    { value: 'الفول كونتاكت', label: 'الفول كونتاكت', icon: <FaDumbbell /> },
    { value: 'كمال الأجسام', label: 'كمال الأجسام', icon: <FaDumbbell /> },
  ];

  if (!showForm) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="overflow-auto h-full bg-gray-50 p-4"
      >
        <StyledPaper className="max-w-5xl mx-auto">
          {/* En-tête */}
          <div className="bg-gradient-to-r from-red-600 to-red-800 p-6 text-white">
            <div className="flex items-center space-x-3">
              <FaDumbbell className="text-2xl" />
              <Typography variant="h4" component="h1" className="font-bold">
                اختر نوع الرياضة للتسجيل
              </Typography>
            </div>
          </div>

          {/* Sélection des sports */}
          <div className="p-6">
            <Typography variant="h6" gutterBottom className="text-gray-700 mb-6">
              الرجاء اختيار نوع الرياضة التي تريد تسجيل العضو فيها
            </Typography>

            <Grid container spacing={3} justifyContent="center">
              {sportOptions.map((sport) => (
                <Grid item xs={12} sm={6} md={4} key={sport.value}>
                  <SportCard>
                    <CardActionArea onClick={() => handleSportSelect(sport.value)}>
                      <CardContent>
                        <div className="text-4xl mb-4 text-red-600">
                          {sport.icon}
                        </div>
                        <Typography variant="h5" component="div">
                          {sport.label}
                        </Typography>
                        <div className="mt-4 flex justify-center">
                          <Button
                            variant="outlined"
                            color="primary"
                            endIcon={<FaArrowRight />}
                          >
                            اختر
                          </Button>
                        </div>
                      </CardContent>
                    </CardActionArea>
                  </SportCard>
                </Grid>
              ))}
            </Grid>
          </div>
        </StyledPaper>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="overflow-auto h-full bg-gray-50 p-4"
    >
      <StyledPaper className="max-w-5xl mx-auto">
        {/* En-tête avec bouton retour */}
        <div className="bg-gradient-to-r from-red-600 to-red-800 p-6 text-white">
          <div className="flex items-center justify-between">
            <Button 
              variant="outlined" 
              color="inherit"
              onClick={() => {
                setShowForm(false);
                setSelectedSport(null);
              }}
              startIcon={<FaArrowRight style={{ transform: 'rotate(180deg)' }} />}
            >
              العودة
            </Button>
            <div className="flex items-center space-x-3">
              <FaDumbbell className="text-2xl" />
              <Typography variant="h4" component="h1" className="font-bold">
                تسجيل عضو في {selectedSport}
              </Typography>
            </div>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="p-6">
          {/* Section photo et ID */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            {/* Upload photo */}
            <div className="flex flex-col items-center mb-6 md:mb-0">
              <div className="relative">
                <Avatar
                  src={previewImage}
                  sx={{ 
                    width: 120, 
                    height: 120,
                    border: '4px solid #e53e3e',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                  }}
                >
                  <FaCamera className="text-4xl text-gray-400" />
                </Avatar>
                <IconButton
                  component="label"
                  color="primary"
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    backgroundColor: '#e53e3e',
                    '&:hover': { backgroundColor: '#c53030' },
                  }}
                >
                  <FaCamera className="text-white" />
                  <input
                    type="file"
                    hidden
                    onChange={handlePhotoChange}
                    accept="image/*"
                  />
                </IconButton>
              </div>
              <Typography variant="body2" className="mt-2 text-gray-600">
                صورة العضو
              </Typography>
            </div>

            {/* Numéro de membre */}
            <div className="w-full md:w-1/4">
              <TextField
                fullWidth
                label="رقم العضوية"
                variant="outlined"
                required
                InputLabelProps={{
                  style: { 
                    fontSize: '1.1rem',
                    fontWeight: 'bold'
                  }
                }}
                id="id"
                name="id"
                value={formData.id}
                onChange={handleChange}
                InputProps={{
                  startAdornment: <FaIdCard className="mr-2 text-gray-500" />,
                }}
              />
            </div>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <Grid container spacing={3}>
              {/* Informations personnelles */}
              <Grid item xs={12} md={6}>
                <TextField
                  label="الاسم العائلي"
                  variant="outlined"
                  InputLabelProps={{
                    style: { 
                      fontSize: '1.1rem',
                      fontWeight: 'bold'
                    }
                  }}
                  id="first_name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                  fullWidth
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  label="الاسم الشخصي"
                  variant="outlined"
                  InputLabelProps={{
                    style: { 
                      fontSize: '1.1rem',
                      fontWeight: 'bold'
                    }
                  }}
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                  fullWidth
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  label="تاريخ الازدياد"
                  variant="outlined"
                  InputLabelProps={{
                    style: { 
                      fontSize: '1.1rem',
                      fontWeight: 'bold'
                    }
                  }}
                  id="date_naissance"
                  name="date_naissance"
                  inputRef={dateNaissanceRef}
                  value={formData.date_naissance}
                  onChange={handleChange}
                  required
                  fullWidth
                  InputProps={{
                    startAdornment: <FaBirthdayCake className="mr-2 text-gray-500" />,
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  label="بطاقة الهوية"
                  variant="outlined"
                  InputLabelProps={{
                    style: { 
                      fontSize: '1.1rem',
                      fontWeight: 'bold'
                    }
                  }}
                  id="cin"
                  name="cin"
                  value={formData.cin}
                  onChange={handleChange}
                  fullWidth
                  InputProps={{
                    startAdornment: <FaIdCard className="mr-2 text-gray-500" />,
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  label="المهنة"
                  variant="outlined"
                  InputLabelProps={{
                    style: { 
                      fontSize: '1.1rem',
                      fontWeight: 'bold'
                    }
                  }}
                  id="profession"
                  name="profession"
                  value={formData.profession}
                  onChange={handleChange}
                  fullWidth
                  InputProps={{
                    startAdornment: <FaBriefcase className="mr-2 text-gray-500" />,
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  label="العنوان"
                  variant="outlined"
                  InputLabelProps={{
                    style: { 
                      fontSize: '1.1rem',
                      fontWeight: 'bold'
                    }
                  }}
                  id="adresse"
                  name="adresse"
                  value={formData.adresse}
                  onChange={handleChange}
                  fullWidth
                  InputProps={{
                    startAdornment: <FaHome className="mr-2 text-gray-500" />,
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  label="الهاتف"
                  variant="outlined"
                  InputLabelProps={{
                    style: { 
                      fontSize: '1.1rem',
                      fontWeight: 'bold'
                    }
                  }}
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  fullWidth
                  InputProps={{
                    startAdornment: <FaPhone className="mr-2 text-gray-500" />,
                    type: 'tel',
                  }}
                />
              </Grid>

              {/* Ligne pour تاريخ التامين والتأمين */}
              <Grid item xs={12} md={6}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      label="تاريخ التامين"
                      variant="outlined"
                      InputLabelProps={{
                        style: { 
                          fontSize: '1.1rem',
                          fontWeight: 'bold'
                        }
                      }}
                      id="registration_date"
                      name="registration_date"
                      inputRef={assiranceDateRef}
                      onChange={handleChange}
                      fullWidth
                      InputProps={{
                        startAdornment: <FaShieldAlt className="mr-2 text-gray-500" />,
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="التأمين"
                      variant="outlined"
                      InputLabelProps={{
                        style: { 
                          fontSize: '1.1rem',
                          fontWeight: 'bold'
                        }
                      }}
                      id="assirance"
                      name="assirance"
                      value={formData.assirance}
                      onChange={handleChange}
                      type="number"
                       inputProps={{
    step: "0.01",
    min: "0"
  }}
  error={formData.assirance !== '' && isNaN(parseFloat(formData.assirance))}
  helperText={formData.assirance !== '' && isNaN(parseFloat(formData.assirance)) ? 
              "يجب إدخال رقم صحيح" : ""}
                      fullWidth
                      InputProps={{
                        startAdornment: <FaMoneyBillWave className="mr-2 text-gray-500" />,
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="المبلغ"
                  variant="outlined"
                  id="price"
                  name="price"
                  value={formData.price === 0 ? '' : formData.price}
                  onChange={handleChange}
                  type="number"
                  required
                  fullWidth
                  InputProps={{
                    startAdornment: <FaMoneyBillWave className="mr-2 text-gray-500" />,
                  }}
                />
              </Grid>

              {/* Champ unique pour تاريخ الانخراط */}
              <Grid item xs={12} md={6}>
                <TextField
                  label="تاريخ الانخراط"
                  variant="outlined"
                  id="start_date"
                  name="start_date"
                  inputRef={startDateRef}
                  fullWidth
                  required
                  InputProps={{
                    startAdornment: <FaCalendarAlt className="mr-2 text-gray-500" />,
                  }}
                  helperText="سيتم حساب تاريخ الانتهاء تلقائياً (بعد 30 يوماً)"
                />
              </Grid>
            </Grid>

            {/* Bouton de soumission */}
            <div className="flex justify-end mt-8">
              <StyledButton
                type="submit"
                variant="contained"
                color="error"
                size="large"
                startIcon={<FaUserPlus />}
                disabled={isSubmitting}
                sx={{
                  background: 'linear-gradient(45deg, #e53e3e 30%, #c53030 90%)',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                }}
              >
                {isSubmitting ? 'جاري الحفظ...' : 'تأكيد التسجيل'}
              </StyledButton>
            </div>
          </form>
        </div>
      </StyledPaper>
    </motion.div>
  );
};

Inscription.propTypes = {
  // PropTypes si nécessaire
};

export default Inscription;