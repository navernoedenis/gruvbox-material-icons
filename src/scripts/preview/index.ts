import { fileIcons } from './../../icons/fileIcons';
import { folderIcons } from './../../icons/folderIcons';
import { languageIcons } from './../../icons/languageIcons';
import { generatePreview } from './preview';
import { FolderType } from '../../models';

const filterDuplicates = (icons: string[]) => {
  return [...new Set(icons)];
};

const basicFileIcons = filterDuplicates(
  fileIcons.icons
    .map((i) => i.name)
    // merge language icons
    .concat(languageIcons.map((i) => i.icon.name))
).map((i) => ({ iconName: i, label: i }));

const folderThemes = (type: FolderType) => {
  let regex = /folder-/gi;
  let prefix = 'folder-';

  if (type === 'colorful') {
    const foldername = 'colorful-folder-';
    regex = new RegExp(foldername, 'gi');
    prefix = foldername;
  }

  return filterDuplicates(
    folderIcons
      .map((theme) => {
        const folders = [];
        if (theme.icons && theme.icons.length > 0) {
          folders.push(
            ...theme.icons
              .filter((icon) => icon.name.startsWith(prefix))
              .map((i) => i.name)
          );
        }
        return [...folders];
      })
      .reduce((a, b) => a.concat(b))
  ).map((i) => ({
    iconName: i,
    label: i.replace(regex, ''),
  }));
};

generatePreview('fileIcons', basicFileIcons, 5, [
  'virtual',
  'powerpoint',
  'word',
  'credits',
]);

generatePreview('folderIcons-specific', folderThemes('specific'), 5, [
  'folder-aurelia',
  'folder-phpmailer',
  'folder-syntax',
  'folder-ansible',
]);

generatePreview('folderIcons-colorful', folderThemes('colorful'), 5, [
  'folder-aurelia',
  'folder-phpmailer',
  'folder-syntax',
  'folder-ansible',
]);
