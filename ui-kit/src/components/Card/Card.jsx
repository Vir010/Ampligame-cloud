import './Card.css';

function Card({
  image,
  title,
  price,
  children,
  layout = 'vertical',
}) {
  return (
    <div className={`card card--${layout}`}>
      <img className="card_image" src={image} alt={title} />
      <div className="card_body">
        <h3 className="card_title">{title}</h3>
        <p className="card_price">{price}</p>
        {children && (
          <div className="card_actions">{children}</div>
        )}
      </div>
    </div>
  );
}

export default Card;
