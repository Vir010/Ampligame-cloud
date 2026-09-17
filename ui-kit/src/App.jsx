import Button from './components/Button/Button';
import Badge from './components/Badge/Badge';
import Card from './components/Card/Card';
import Input from './components/Input/Input';
import './App.css';

function App() {
  return (
    <div className="app">
      <h1>UI Kit</h1>

      <section className="app__section">
        <h2>Кнопки</h2>
        <div className="app__row">
          <Button variant="primary" className="button button--primary">Сохранить</Button>
          <Button variant="secondary" className="button button--secondary">Отмена</Button>
          <Button variant="danger" className="button button--danger">Удалить</Button>
          <Button variant="primary" className="button button--primary" disabled={true}>
            Недоступно
          </Button>
        </div>
      </section>

      <section className="app__section">
        <h2>Бейджи</h2>
        <div className="app__row">
          <Badge variant="success">Активен</Badge>
          <Badge variant="warning">Ожидание</Badge>
          <Badge variant="error">Ошибка</Badge>
          <Badge variant="neutral">Черновик</Badge>
        </div>
      </section>

      <section className="app__section">
        <h2>Карточки</h2>
        <div className="app__row">
          <Card
            image="https://placehold.co/280x180"
            title="Кофеварка"
            price="4 990 ₽"
          >
            <Badge variant="success">В наличии</Badge>
            <Button variant="primary" className="button button--primary">В корзину</Button>
          </Card>
          <Card
            image="https://placehold.co/100x100"
            title="Чайник"
            price="1 990 ₽"
            layout="horizontal"
          >
            <Button variant="secondary" className="button button--secondary">Подробнее</Button>
          </Card>
        </div>
      </section>

      <section className="app__section">
        <h2>Поля ввода</h2>
        <div className="app__row">
          <Input
            label="Электронная почта"
            placeholder="example@mail.ru"
            hint="Мы не рассылаем спам"
          />
          <Input
            label="Пароль"
            type="password"
            placeholder="Введите пароль"
            hint="Пароль слишком короткий"
            error={true}
          />
        </div>
      </section>
    </div>
  );
}

export default App;
