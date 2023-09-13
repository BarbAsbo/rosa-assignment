import 'package:flutter/material.dart';

Widget selectionCard(
  BuildContext context, {
  required Widget child,
  bool isSelectable = true,
  bool isSelected = false,
  void Function()? onTap,
}) {
  return InkWell(
    onTap: onTap,
    child: Card(
      color: isSelectable
          ? isSelected
              ? Theme.of(context).primaryColor.withOpacity(0.15)
              : Colors.white
          : Colors.grey[300],
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 20.0),
        child: child,
      ),
    ),
  );
}
