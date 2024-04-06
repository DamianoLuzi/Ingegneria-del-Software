function RuoliMenu (props: any) {

  const handleChange = (e: any ) => {
    const selectedRole = e.target.value;
    props.handleChange({ target: { name: "ruolo", value: selectedRole } });
  };
 
  return(
    <div className="container">
      <div className="row">
        <div className="col-sm-12">
          <form>
            <div className="radio">
              <label>
                <input
                  type="radio"
                  value="ristorante"
                  checked={props.selectedRole === 'ristorante'}
                  onChange={handleChange}
                />
                Ristorante
              </label>
            </div>
            <div className="radio">
              <label>
                <input
                  type="radio"
                  value="cliente"
                  checked={props.selectedRole === 'cliente'}
                  onChange={handleChange}
                />
                Cliente
              </label>
            </div>
            <div className="radio">
              <label>
                <input
                  type="radio"
                  value="rider"
                  checked={props.selectedRole=== 'rider'}
                  onChange={handleChange}
                />
                Rider
              </label>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default RuoliMenu