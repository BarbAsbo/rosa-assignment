import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../bloc/appointment_bloc.dart';
import '../models/location_model.dart';
import '../widgets/selection_button.dart';
import '../widgets/selection_card.dart';

class ChooseLocationPage extends StatefulWidget {
  final void Function(int index) setIndex;

  const ChooseLocationPage({super.key, required this.setIndex});

  @override
  State<ChooseLocationPage> createState() => _ChooseLocationPageState();
}

class _ChooseLocationPageState extends State<ChooseLocationPage> {
  final String title = 'Choisissez un emplacement';
  final String notAvailable = 'Aucune disponibilité en ligne';
  final String prendreRendezVous = 'Prendre rendez-vous avec';
  final String name = 'Antoine Pairet';
  final List<LocationModel> locationList = [
    LocationModel(
      name: 'Mon Cabinet',
      address: 'Cantersteen 10, 1000 Bruxelles',
      isAvailable: true,
    ),
    LocationModel(
      name: 'Arbalethe',
      address: 'Cantersteen 20, 1000 Bruxelles',
      isAvailable: false,
    ),
    LocationModel(
      name: 'Home Sweet Home',
      address: 'Cantersteen 30, 1000 Bruxelles',
      isAvailable: false,
    ),
  ];

  LocationModel? selectedLocation;

  @override
  void initState() {
    super.initState();
    if (BlocProvider.of<AppointmentBloc>(context).tempAddress != null) {
      selectedLocation = locationList.firstWhere(
        (element) =>
            element.address ==
            BlocProvider.of<AppointmentBloc>(context).tempAddress,
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(20, 20, 20, 0),
      child: Column(
        children: [
          Expanded(child: chooseLocationMainWidget()),
          continueButton(),
        ],
      ),
    );
  }

  Widget chooseLocationMainWidget() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisAlignment: MainAxisAlignment.spaceAround,
      children: [
        Flexible(
          flex: 1,
          child: Text(
            title,
            style: Theme.of(context).textTheme.titleLarge,
          ),
        ),
        Flexible(
          flex: 6,
          child: ListView.builder(
            itemCount: locationList.length,
            itemBuilder: (context, index) {
              return locationCard(locationList[index]);
            },
          ),
        ),
      ],
    );
  }

  Widget continueButton() {
    return selectionButton(
      context,
      title: 'Continuer',
      isSelectable: selectedLocation != null,
      onPressed: () {
        BlocProvider.of<AppointmentBloc>(context).tempAddress =
            selectedLocation!.address;
        widget.setIndex(1);
      },
    );
  }

  Widget locationCard(LocationModel locationModel) {
    bool isSelected = selectedLocation == locationModel;
    Widget isSelectedIcon = isSelected
        ? SizedBox(
            width: 50,
            child: Center(
              child: Icon(
                Icons.check_circle,
                color: Theme.of(context).primaryColor,
                size: 25,
              ),
            ),
          )
        : const SizedBox(width: 50);
    return selectionCard(
      context,
      isSelectable: locationModel.isAvailable,
      isSelected: isSelected,
      onTap: () {
        if (locationModel.isAvailable) {
          if (isSelected) {
            setState(() {
              selectedLocation = null;
            });
          } else {
            setState(() {
              selectedLocation = locationModel;
            });
          }
        }
      },
      child: Row(
        children: [
          isSelectedIcon,
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(locationModel.name),
              const SizedBox(height: 5),
              locationModel.isAvailable
                  ? Text(locationModel.address)
                  : Text(notAvailable),
            ],
          ),
        ],
      ),
    );
  }
}
