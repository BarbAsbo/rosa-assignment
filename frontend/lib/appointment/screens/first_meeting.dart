import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../bloc/appointment_bloc.dart';
import '../widgets/selection_button.dart';
import '../widgets/selection_card.dart';

class FirstMeetingPage extends StatefulWidget {
  final void Function(int index) setIndex;

  const FirstMeetingPage({super.key, required this.setIndex});

  @override
  State<FirstMeetingPage> createState() => _FirstMeetingPageState();
}

class _FirstMeetingPageState extends State<FirstMeetingPage> {
  final String title = 'Est-ce la première fois que vous voyez ce praticien ?';
  final List<String> newPatientOptions = [
    'Oui, je suis un nouveau patient',
    'Non, je suis déjà patient',
  ];

  bool? isNewPatient;

  @override
  void initState() {
    super.initState();
    if (BlocProvider.of<AppointmentBloc>(context).tempClientStatus ==
        newPatientOptions[0]) {
      isNewPatient = true;
    } else if (BlocProvider.of<AppointmentBloc>(context).tempClientStatus ==
        newPatientOptions[1]) {
      isNewPatient = false;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(20, 20, 20, 0),
      child: Column(
        children: [
          Expanded(child: firstMeetingMainWidget()),
          Row(
            children: [
              Flexible(
                flex: 1,
                child: previousButton(),
              ),
              Flexible(
                flex: 1,
                child: continueButton(),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget firstMeetingMainWidget() {
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
            itemCount: newPatientOptions.length,
            itemBuilder: (context, index) {
              return firstMeetingCard(newPatientOptions[index], index == 0);
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
      isSelectable: isNewPatient != null,
      onPressed: () {
        BlocProvider.of<AppointmentBloc>(context).tempClientStatus =
            newPatientOptions[isNewPatient! ? 0 : 1];
        widget.setIndex(2);
      },
    );
  }

  Widget previousButton() {
    return selectionButton(
      context,
      title: 'Précédent',
      isSelectable: true,
      onPressed: () {
        widget.setIndex(0);
      },
    );
  }

  Widget firstMeetingCard(String title, bool value) {
    bool isSelected = isNewPatient == value;
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
      isSelected: isSelected,
      onTap: () {
        if (isSelected) {
          setState(() {
            isNewPatient = null;
          });
        } else {
          setState(() {
            isNewPatient = value;
          });
        }
      },
      child: Row(
        children: [
          isSelectedIcon,
          Text(title),
        ],
      ),
    );
  }
}
