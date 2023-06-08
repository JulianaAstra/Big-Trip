import { RenderPosition, render } from '../framework/render.js';
import { updateItem } from '../utils/trip.js';
import TripListView from '../view/trip-list-view.js';
import TripPresenter from './trip-presenter.js';
import NoTripView from '../view/no-trip-view.js';
import SortingView from '../view/sorting-view.js';
import { sortTrips } from '../utils/sorting.js';
import { SortTypes } from '../constants.js';

export default class BoardPresenter {
  #tripListContainer;
  #tripsModel;
  #trips;
  #offers;
  #destinations;
  #destinationsList;
  #tripListComponent;
  #sortingComponent;
  #noTripComponent = new NoTripView({filterType: 'EVERYTHING'});
  #tripPresenters = new Map();
  #currentSortType = SortTypes.DAY;

  constructor({tripListContainer, tripsModel}) {
    this.#tripListContainer = tripListContainer;
    this.#tripsModel = tripsModel;
  }

  init() {
    this.#tripListComponent = new TripListView();
    this.#trips = [...this.#tripsModel.trips];
    this.#offers = [...this.#tripsModel.offers];
    this.#destinations = [...this.#tripsModel.destinations];
    this.#destinationsList = [...this.#tripsModel.destinationsList];

    this.#sortTrips(this.#currentSortType);
    this.#renderBoard();
  }

  #renderBoard() {
    render(this.#tripListComponent, this.#tripListContainer);

    if (this.#trips.length < 1) {
      this.#renderNoTrips();
      return;
    }

    this.#renderSort();
    this.#renderList();
  }

  #renderNoTrips() {
    render(this.#noTripComponent, this.#tripListContainer);
  }

  #renderSort() {
    this.#sortingComponent = new SortingView({
      onSortTypeChange: this.#handleSortTypeChange
    });
    render(this.#sortingComponent, this.#tripListContainer, RenderPosition.AFTERBEGIN);
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortTrips(sortType);
    this.#clearTripList();
    this.#renderList();
  };

  #sortTrips(sortType) {
    sortTrips(this.#trips, sortType);
    this.#currentSortType = sortType;
  }

  #clearTripList() {
    this.#tripPresenters.forEach((presenter) => presenter.destroy());
    this.#tripPresenters.clear();
  }

  #renderList() {
    for (let i = 0; i < this.#trips.length; i++) {
      this.#renderTrip(this.#trips[i], this.#offers, this.#destinations, this.#destinationsList);
    }
  }

  #renderTrip(trip, offers, destinations, destinationsList) {
    const tripPresenter = new TripPresenter({tripContainer: this.#tripListComponent.element, onDataChange: this.#handleTripChange, onModeChange: this.#handleModeChange});
    tripPresenter.init(trip, offers, destinations, destinationsList);
    this.#tripPresenters.set(trip.id, tripPresenter);
  }

  #handleModeChange = () => {
    this.#tripPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleTripChange = (updatedTrip, offers, destinations, destinationsList) => {
    this.#trips = updateItem(this.#trips, updatedTrip);
    this.#tripPresenters.get(updatedTrip.id).init(updatedTrip, offers, destinations, destinationsList);
    this.#sortTrips(this.#currentSortType);
    this.#clearTripList();
    this.#renderList();
  };
}
