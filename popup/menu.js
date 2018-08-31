const onError = (error) => {
  console.log(`Error: ${error}`);
};

const restoreOptions = () => {
};

const copy = (flag_nam) => {
};

document.addEventListener('click', (e) => {
  if(e.target.id.indexOf('copy_') === 0) {
    console.log('let us copy ' + e.target.id);
    const flag_nam = e.target.id.replace(/^copy_(.+)$/, '$1');
    copy(flag_nam);
  }
});

document.addEventListener('DOMContentLoaded', restoreOptions);

// vim:expandtab ff=dos fenc=utf-8 sw=2
