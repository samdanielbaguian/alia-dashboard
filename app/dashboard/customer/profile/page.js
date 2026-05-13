'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, Card, CardContent, Tabs, Tab, TextField,
  Button, Grid, Divider, Alert, Switch, InputAdornment, IconButton,
} from '@mui/material';
import {
  Person, Home, Settings, Lock, Save, Visibility, VisibilityOff, Phone,
} from '@mui/icons-material';
import { useAuth } from '@/hooks/useAuth';
import CustomerDashboardLayout from '@/layout/CustomerDashboardLayout';
import { mockProfile } from '@/utils/mockData';

function TabPanel({ children, value, index }) {
  return (
    <Box role="tabpanel" hidden={value !== index} sx={{ pt: 3 }}>
      {value === index && children}
    </Box>
  );
}

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const [tab, setTab]         = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [toast, setToast]     = useState({ show: false, msg: '', sev: 'info' });

  const [infos, setInfos] = useState({ first_name: '', last_name: '', phone: '', birth_date: '', bio: '' });
  const setInfo = (field) => (val) => setInfos(f => ({ ...f, [field]: val }));

  const [address, setAddress] = useState({ street: '', city: '', country: 'Côte d\'Ivoire', zip: '' });
  const setAddr = (field) => (val) => setAddress(a => ({ ...a, [field]: val }));

  const [prefs, setPrefs] = useState({ newsletter: false, sms_notif: false, push_notif: true });
  const togglePref = (field) => () => setPrefs(p => ({ ...p, [field]: !p[field] }));

  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' });
  const setPwd = (field) => (val) => setPasswords(p => ({ ...p, [field]: val }));
  const [showPwd, setShowPwd] = useState({ current: false, newPass: false, confirm: false });
  const toggleShow = (field) => () => setShowPwd(p => ({ ...p, [field]: !p[field] }));

  const showToast = (msg, sev = 'success') => {
    setToast({ show: true, msg, sev });
    setTimeout(() => setToast(t => ({ ...t, show: false })), 3500);
  };

  const fetchProfile = useCallback(() => {
    setLoading(true);
    const profile = mockProfile;
    setInfos({
      first_name: profile.first_name || '',
      last_name:  profile.last_name  || '',
      phone:      profile.phone      || '',
      birth_date: profile.birth_date || '',
      bio:        profile.bio        || '',
    });
    if (profile.address) setAddress({ ...{ street: '', city: '', country: "Côte d'Ivoire", zip: '' }, ...profile.address });
    if (profile.preferences) setPrefs(p => ({ ...p, ...profile.preferences }));
    setLoading(false);
  }, []);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  const saveInfos = () => {
    setSaving(true);
    if (setUser) setUser(u => ({ ...u, ...infos }));
    setTimeout(() => { setSaving(false); showToast('Profil mis à jour avec succès'); }, 400);
  };

  const saveAddress = () => {
    setSaving(true);
    setTimeout(() => { setSaving(false); showToast('Adresse mise à jour avec succès'); }, 400);
  };

  const savePrefs = () => {
    setSaving(true);
    setTimeout(() => { setSaving(false); showToast('Préférences enregistrées'); }, 400);
  };

  const savePassword = () => {
    if (passwords.newPass !== passwords.confirm) { showToast('Les mots de passe ne correspondent pas', 'error'); return; }
    if (passwords.newPass.length < 8) { showToast('Le mot de passe doit faire au moins 8 caractères', 'error'); return; }
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setPasswords({ current: '', newPass: '', confirm: '' });
      showToast('Mot de passe modifié avec succès');
    }, 400);
  };

  const userInitial = (infos.first_name || user?.email || 'A')[0].toUpperCase();
  const fullName = [infos.first_name, infos.last_name].filter(Boolean).join(' ') || user?.email || 'Acheteur';

  const TABS = [
    { label: 'Informations', icon: <Person /> },
    { label: 'Adresse',      icon: <Home /> },
    { label: 'Préférences',  icon: <Settings /> },
    { label: 'Sécurité',     icon: <Lock /> },
  ];

  const btnSx = { textTransform: 'none', borderRadius: 2, fontWeight: 700, px: 3, background: 'linear-gradient(135deg, #a855f7, #ec4899)', boxShadow: 'none' };

  return (
    <CustomerDashboardLayout title="Mon profil">
      {toast.show && (
        <Alert severity={toast.sev} variant="filled"
          sx={{ position: 'fixed', top: 80, right: 24, zIndex: 9999, borderRadius: 2, boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}>
          {toast.msg}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Sidebar */}
        <Grid size={{ xs: 12, md: 3 }}>
          <Card sx={{ borderRadius: 2.5, boxShadow: '0 2px 16px rgba(0,0,0,0.07)', textAlign: 'center' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ width: 88, height: 88, borderRadius: '50%', background: 'linear-gradient(135deg, #a855f7, #ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2, boxShadow: '0 4px 16px rgba(168,85,247,0.4)' }}>
                <Typography sx={{ fontSize: '2rem', fontWeight: 800, color: '#fff' }}>{userInitial}</Typography>
              </Box>
              <Typography sx={{ fontWeight: 800, color: '#1e1b4b', mb: 0.3 }}>{fullName}</Typography>
              <Typography sx={{ fontSize: '0.78rem', color: '#6b7280', mb: 1.5 }} noWrap>{user?.email}</Typography>
              <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, bgcolor: '#ede9fe', color: '#7c3aed', px: 1.5, py: 0.4, borderRadius: 10, fontSize: '0.75rem', fontWeight: 700 }}>
                <Person sx={{ fontSize: 14 }} /> Acheteur
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Tabs */}
        <Grid size={{ xs: 12, md: 9 }}>
          <Card sx={{ borderRadius: 2.5, boxShadow: '0 2px 16px rgba(0,0,0,0.07)' }}>
            <Box sx={{ borderBottom: '1px solid #f1f5f9', px: 2 }}>
              <Tabs value={tab} onChange={(_, v) => setTab(v)}
                sx={{ '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, fontSize: '0.83rem', minHeight: 52 }, '& .Mui-selected': { color: '#7c3aed' }, '& .MuiTabs-indicator': { bgcolor: '#a855f7', height: 3, borderRadius: '3px 3px 0 0' } }}>
                {TABS.map((t, i) => <Tab key={i} label={t.label} icon={t.icon} iconPosition="start" />)}
              </Tabs>
            </Box>

            <Box sx={{ p: 3 }}>
              {/* Tab 1 — Informations */}
              <TabPanel value={tab} index={0}>
                <Grid container spacing={2.5}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField fullWidth size="small" label="Prénom" value={infos.first_name} onChange={e => setInfo('first_name')(e.target.value)} disabled={loading} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField fullWidth size="small" label="Nom" value={infos.last_name} onChange={e => setInfo('last_name')(e.target.value)} disabled={loading} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField fullWidth size="small" label="Email" value={user?.email || ''} disabled
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                    <Typography sx={{ fontSize: '0.72rem', color: '#9ca3af', mt: 0.5, ml: 0.5 }}>L&apos;email ne peut pas être modifié directement.</Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField fullWidth size="small" label="Téléphone" value={infos.phone} onChange={e => setInfo('phone')(e.target.value)} disabled={loading}
                      InputProps={{ startAdornment: <InputAdornment position="start"><Phone sx={{ fontSize: 16 }} /></InputAdornment> }}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField fullWidth size="small" label="Date de naissance" type="date" value={infos.birth_date} onChange={e => setInfo('birth_date')(e.target.value)} disabled={loading}
                      InputLabelProps={{ shrink: true }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField fullWidth size="small" label="Bio" value={infos.bio} onChange={e => setInfo('bio')(e.target.value)} multiline rows={3} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Button variant="contained" startIcon={<Save />} onClick={saveInfos} disabled={saving || loading} sx={btnSx}>
                      {saving ? 'Sauvegarde...' : 'Enregistrer'}
                    </Button>
                  </Grid>
                </Grid>
              </TabPanel>

              {/* Tab 2 — Adresse */}
              <TabPanel value={tab} index={1}>
                <Grid container spacing={2.5}>
                  {[['street', 'Rue / Quartier', 12], ['city', 'Ville', 6], ['zip', 'Code postal', 6], ['country', 'Pays', 12]].map(([field, label, sm]) => (
                    <Grid key={field} size={{ xs: 12, sm }}>
                      <TextField fullWidth size="small" label={label} value={address[field]} onChange={e => setAddr(field)(e.target.value)} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                    </Grid>
                  ))}
                  <Grid size={{ xs: 12 }}>
                    <Button variant="contained" startIcon={<Save />} onClick={saveAddress} disabled={saving} sx={btnSx}>
                      {saving ? 'Sauvegarde...' : 'Enregistrer l\'adresse'}
                    </Button>
                  </Grid>
                </Grid>
              </TabPanel>

              {/* Tab 3 — Préférences */}
              <TabPanel value={tab} index={2}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {[
                    { field: 'newsletter', label: 'Newsletter',         sub: 'Recevoir les offres promotionnelles par email' },
                    { field: 'sms_notif',  label: 'Notifications SMS',  sub: 'Être notifié par SMS pour les commandes' },
                    { field: 'push_notif', label: 'Notifications push', sub: 'Recevoir les alertes en temps réel' },
                  ].map(({ field, label, sub }) => (
                    <Box key={field} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, bgcolor: '#faf9ff', borderRadius: 2 }}>
                      <Box>
                        <Typography sx={{ fontWeight: 700, fontSize: '0.88rem', color: '#1e1b4b' }}>{label}</Typography>
                        <Typography sx={{ fontSize: '0.77rem', color: '#6b7280' }}>{sub}</Typography>
                      </Box>
                      <Switch checked={prefs[field]} onChange={togglePref(field)}
                        sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#a855f7' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#c4b5fd' } }} />
                    </Box>
                  ))}
                  <Divider />
                  <Button variant="contained" startIcon={<Save />} onClick={savePrefs} disabled={saving} sx={{ ...btnSx, alignSelf: 'flex-start' }}>
                    {saving ? 'Sauvegarde...' : 'Enregistrer'}
                  </Button>
                </Box>
              </TabPanel>

              {/* Tab 4 — Sécurité */}
              <TabPanel value={tab} index={3}>
                <Box sx={{ maxWidth: 440 }}>
                  <Typography sx={{ fontWeight: 700, color: '#1e1b4b', mb: 2.5 }}>Modifier le mot de passe</Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {[
                      { field: 'current', label: 'Mot de passe actuel' },
                      { field: 'newPass', label: 'Nouveau mot de passe' },
                      { field: 'confirm', label: 'Confirmer le nouveau mot de passe' },
                    ].map(({ field, label }) => (
                      <TextField key={field} size="small" fullWidth label={label}
                        type={showPwd[field] ? 'text' : 'password'}
                        value={passwords[field]}
                        onChange={e => setPwd(field)(e.target.value)}
                        InputProps={{ endAdornment: (
                          <InputAdornment position="end">
                            <IconButton size="small" onClick={toggleShow(field)} edge="end">
                              {showPwd[field] ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                            </IconButton>
                          </InputAdornment>
                        ) }}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                      />
                    ))}
                    {passwords.newPass && passwords.confirm && passwords.newPass !== passwords.confirm && (
                      <Alert severity="error" sx={{ borderRadius: 2, py: 0.5 }}>Les mots de passe ne correspondent pas.</Alert>
                    )}
                    <Button variant="contained" startIcon={<Lock />} onClick={savePassword}
                      disabled={saving || !passwords.current || !passwords.newPass || !passwords.confirm}
                      sx={{ ...btnSx, py: 1.1 }}>
                      {saving ? 'Modification...' : 'Modifier le mot de passe'}
                    </Button>
                  </Box>
                </Box>
              </TabPanel>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </CustomerDashboardLayout>
  );
}
