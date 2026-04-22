body { font-family: sans-serif; background: #ccc; margin: 0; padding: 20px; display: flex; justify-content: center; }
.main-container { width: 100%; max-width: 400px; text-align: center; }
.logo-text { color: #f9d423; font-size: 48px; text-shadow: 2px 2px #333; font-weight: black; margin-bottom: 20px; }

/* Сетка кнопок */
.staff-grid { display: flex; flex-direction: column; gap: 10px; }
.name-btn { background: #d35400; color: white; border: none; padding: 15px; border-radius: 8px; font-size: 18px; font-weight: bold; cursor: pointer; }

/* Модальное окно */
.modal-overlay { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); justify-content: center; align-items: center; }
.modal-content { background: white; padding: 30px; border-radius: 20px; width: 80%; max-width: 300px; text-align: center; }
.action-btn { width: 100%; padding: 20px; margin: 10px 0; border: none; border-radius: 12px; color: white; font-size: 18px; font-weight: bold; cursor: pointer; }
.btn-in { background: #27ae60; }
.btn-out { background: #c0392b; }
.btn-cancel { background: none; border: none; color: #555; text-decoration: underline; margin-top: 15px; cursor: pointer; }

#status { margin-top: 10px; font-weight: bold; }
