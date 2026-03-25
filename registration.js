/* ============================================================
   Registration form JS (client-side validation + demo submit)
   ============================================================ */

(function () {
  const form = document.getElementById('registrationForm');
  const status = document.getElementById('registrationStatus');
  const category = document.getElementById('regCategory');

  function setStatus(msg, type) {
    status.textContent = msg;
    status.classList.remove('success', 'error', 'show');
    if (type) status.classList.add(type);
    status.classList.add('show');
  }

  function setTeamBlocks(isTeam) {
    const ids = [
      'teamBlock',
      'member2Block',
      'member2EmailBlock',
      'member3Block',
      'member3EmailBlock',
      'member4Block',
      'member4EmailBlock'
    ];

    ids.forEach(function (id) {
      const el = document.getElementById(id);
      if (!el) return;
      el.style.display = isTeam ? '' : 'none';
    });

    const teamRequiredIds = ['teamName', 'member2Name', 'member2Email'];
    teamRequiredIds.forEach(function (id) {
      const el = document.getElementById(id);
      if (el) el.required = isTeam;
    });
  }

  function isEmailLike(v) {
    const s = String(v || '').trim();
    return s.includes('@') && s.includes('.');
  }

  function normalize(v) {
    return String(v || '').trim();
  }

  if (category) {
    setTeamBlocks(category.value === 'team');
    category.addEventListener('change', function () {
      setTeamBlocks(category.value === 'team');
      if (status) status.classList.remove('show');
    });
  }

  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const data = {
      category: normalize(category && category.value),
      grade: normalize(document.getElementById('participantGrade') && document.getElementById('participantGrade').value),
      participantName: normalize(document.getElementById('participantName') && document.getElementById('participantName').value),
      participantEmail: normalize(document.getElementById('participantEmail') && document.getElementById('participantEmail').value),
      participantPhone: normalize(document.getElementById('participantPhone') && document.getElementById('participantPhone').value),
      school: normalize(document.getElementById('participantSchool') && document.getElementById('participantSchool').value),
      country: normalize(document.getElementById('participantCountry') && document.getElementById('participantCountry').value),

      teamName: normalize(document.getElementById('teamName') && document.getElementById('teamName').value),
      member2Name: normalize(document.getElementById('member2Name') && document.getElementById('member2Name').value),
      member2Email: normalize(document.getElementById('member2Email') && document.getElementById('member2Email').value),
      member3Name: normalize(document.getElementById('member3Name') && document.getElementById('member3Name').value),
      member3Email: normalize(document.getElementById('member3Email') && document.getElementById('member3Email').value),
      member4Name: normalize(document.getElementById('member4Name') && document.getElementById('member4Name').value),
      member4Email: normalize(document.getElementById('member4Email') && document.getElementById('member4Email').value),

      agreement: !!(document.getElementById('agreement') && document.getElementById('agreement').checked)
    };

    // Basic checks
    if (!data.category) return setStatus('Please select registration type.', 'error');
    if (!data.grade) return setStatus('Please select your grade/year.', 'error');
    if (!data.participantName) return setStatus('Please enter Participant 1 full name.', 'error');
    if (!isEmailLike(data.participantEmail)) return setStatus('Please enter a valid Participant 1 email.', 'error');
    if (!data.school) return setStatus('Please enter your school / institution.', 'error');
    if (!data.country) return setStatus('Please enter your country.', 'error');
    if (!data.agreement) return setStatus('Please confirm the agreement checkbox.', 'error');

    // Team checks
    const isTeam = data.category === 'team';
    if (isTeam) {
      if (!data.teamName) return setStatus('Please enter a team name.', 'error');
      if (!data.member2Name) return setStatus('Please enter Member 2 full name.', 'error');
      if (!isEmailLike(data.member2Email)) return setStatus('Please enter a valid Member 2 email.', 'error');
    }

    // If optional members were filled, require matching email
    if (data.member3Name && !isEmailLike(data.member3Email)) {
      return setStatus('If Member 3 name is provided, please enter a valid Member 3 email.', 'error');
    }
    if (data.member4Name && !isEmailLike(data.member4Email)) {
      return setStatus('If Member 4 name is provided, please enter a valid Member 4 email.', 'error');
    }

    // Demo "submission"
    const year = new Date().getFullYear();
    const ref = 'BIO-' + year + '-' + Math.random().toString(16).slice(2, 8).toUpperCase();

    try {
      const key = 'bioleague-registrations';
      const prev = JSON.parse(localStorage.getItem(key) || '[]');
      prev.push({ ref, submittedAt: new Date().toISOString(), ...data });
      localStorage.setItem(key, JSON.stringify(prev));
    } catch (err) {
      // Ignore storage errors (e.g., privacy mode)
    }

    setStatus('Registration submitted successfully! Your reference code is ' + ref + '.', 'success');
    form.reset();
    if (category) setTeamBlocks(false);
  });
})();

