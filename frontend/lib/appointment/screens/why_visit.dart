import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../bloc/appointment_bloc.dart';
import '../widgets/selection_button.dart';
import '../widgets/selection_card.dart';

class WhyVisitPage extends StatefulWidget {
  final void Function(int index) setIndex;

  const WhyVisitPage({super.key, required this.setIndex});

  @override
  State<WhyVisitPage> createState() => _WhyVisitPageState();
}

class _WhyVisitPageState extends State<WhyVisitPage> {
  final String title = 'Est-ce la première fois que vous voyez ce praticien ?';
  final List<String> whyVisitOptions = [
    'Business Meeting',
    'Cultural fit',
    'Introduction call',
    'Technical assessment',
  ];

  String? whyVisit;

  @override
  void initState() {
    super.initState();
    whyVisit = BlocProvider.of<AppointmentBloc>(context).tempReason;
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(20, 20, 20, 0),
      child: Column(
        children: [
          Expanded(child: whyVisitMainWidget()),
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

  Widget whyVisitMainWidget() {
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
            itemCount: whyVisitOptions.length,
            itemBuilder: (context, index) {
              return whyVisitCard(whyVisitOptions[index]);
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
      isSelectable: whyVisit != null,
      onPressed: () {
        BlocProvider.of<AppointmentBloc>(context).tempReason = whyVisit ?? '';
        widget.setIndex(3);
      },
    );
  }

  Widget previousButton() {
    return selectionButton(
      context,
      title: 'Précédent',
      isSelectable: true,
      onPressed: () {
        widget.setIndex(1);
      },
    );
  }

  Widget whyVisitCard(String title) {
    bool isSelected = whyVisit == title;
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
            whyVisit = null;
          });
        } else {
          setState(() {
            whyVisit = title;
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
